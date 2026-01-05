import type { AppLocale } from "@/config/i18n";
import { DEFAULT_LOCALE } from "@/config/i18n";
import {
  REFERRAL_REFEREE_POINTS,
  REFERRAL_REFERER_POINTS,
  formatReferralUrl,
  generateReferralCode,
} from "@/config/referrals";
import { prisma } from "@/lib/prisma";

export type ReferralUsageSummary = {
  id: string;
  referredEmail: string;
  createdAt: Date;
  rewardedReferer: boolean;
};

export type ReferralStats = {
  code: string;
  shareUrl: string;
  usageCount: number;
  recentUsages: ReferralUsageSummary[];
  refererReward: number;
  refereeReward: number;
  isActive: boolean;
};

type CreateReferralCodeInput = {
  createdById?: string;
  label?: string;
  description?: string;
  rewardPoints?: number;
  isActive?: boolean;
  code?: string;
};

export async function createReferralCode(
  input: CreateReferralCodeInput
): Promise<{
  id: string;
  code: string;
  label?: string | null;
  description?: string | null;
  rewardPoints: number;
  isActive: boolean;
  createdAt: Date;
}> {
  const refererReward = Math.max(
    0,
    input.rewardPoints ?? REFERRAL_REFERER_POINTS
  );
  const baseCode = input.code
    ? input.code.trim().toUpperCase()
    : generateReferralCode(input.createdById ?? "ADMIN");

  const data = {
    code: baseCode,
    label: input.label,
    description: input.description,
    rewardPoints: refererReward,
    isActive: input.isActive ?? true,
    createdById: input.createdById,
  };

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const created = await prisma.referralCode.create({ data });
      return {
        id: created.id,
        code: created.code,
        label: created.label,
        description: created.description,
        rewardPoints: created.rewardPoints,
        isActive: created.isActive,
        createdAt: created.createdAt,
      };
    } catch (error) {
      const code = (error as any)?.code;
      if (code === "P2002") {
        data.code = generateReferralCode(input.createdById ?? "ADMIN");
        continue;
      }
      throw error;
    }
  }

  throw new Error("No se pudo generar un codigo de referidos unico.");
}

export async function ensureReferralCodeForUser(
  userId: string
): Promise<{ id: string; code: string; rewardPoints: number; isActive: boolean }> {
  const existing = await prisma.referralCode.findFirst({
    where: { createdById: userId },
  });
  if (existing) {
    return {
      id: existing.id,
      code: existing.code,
      rewardPoints: existing.rewardPoints,
      isActive: existing.isActive,
    };
  }

  const created = await createReferralCode({ createdById: userId });
  return {
    id: created.id,
    code: created.code,
    rewardPoints: created.rewardPoints,
    isActive: created.isActive,
  };
}

export async function getUserReferralStats(
  userId: string,
  lang?: AppLocale
): Promise<ReferralStats> {
  const resolvedLang = lang ?? DEFAULT_LOCALE;
  const code = await ensureReferralCodeForUser(userId);
  const [usageCount, recentUsages] = await Promise.all([
    prisma.referralUsage.count({ where: { referralCodeId: code.id } }),
    prisma.referralUsage.findMany({
      where: { referralCodeId: code.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return {
    code: code.code,
    shareUrl: formatReferralUrl(code.code, resolvedLang),
    usageCount,
    recentUsages: recentUsages.map((usage) => ({
      id: usage.id,
      referredEmail: usage.referredEmail,
      createdAt: usage.createdAt,
      rewardedReferer: usage.rewardedReferer,
    })),
    refererReward: code.rewardPoints,
    refereeReward: REFERRAL_REFEREE_POINTS,
    isActive: code.isActive,
  };
}

type ApplyReferralInput = {
  referralCode: string;
  referredUserId: string;
  referredEmail: string;
};

export async function applyReferralCodeForUser(
  input: ApplyReferralInput
): Promise<{
  usage?: ReferralUsageSummary;
  refererReward: number;
  refereeReward: number;
} | null> {
  const normalizedCode = input.referralCode.trim().toUpperCase();
  const referral = await prisma.referralCode.findUnique({
    where: { code: normalizedCode },
  });
  if (!referral || !referral.isActive) {
    return null;
  }

  const existing = await prisma.referralUsage.findFirst({
    where: { referredUserId: input.referredUserId },
  });
  if (existing) {
    return null;
  }

  const refererReward = Math.max(0, referral.rewardPoints);
  const refereeReward = REFERRAL_REFEREE_POINTS;

  const usage = await prisma.$transaction(async (tx) => {
    const createdUsage = await tx.referralUsage.create({
      data: {
        referralCodeId: referral.id,
        referredUserId: input.referredUserId,
        referredEmail: input.referredEmail.toLowerCase(),
        refererRewardPoints: refererReward,
        refereeRewardPoints: refereeReward,
        rewardedReferer: Boolean(referral.createdById),
        rewardedReferee: true,
      },
    });

    if (referral.createdById) {
      await tx.user.update({
        where: { id: referral.createdById },
        data: { referralPoints: { increment: refererReward } },
      });
    }

    await tx.user.update({
      where: { id: input.referredUserId },
      data: {
        referralPoints: { increment: refereeReward },
        usedReferralCodeId: referral.id,
      },
    });

    return createdUsage;
  });

  return {
    usage: {
      id: usage.id,
      referredEmail: usage.referredEmail,
      createdAt: usage.createdAt,
      rewardedReferer: usage.rewardedReferer,
    },
    refererReward,
    refereeReward,
  };
}
