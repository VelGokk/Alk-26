import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import { getUserReferralStats, createReferralCode } from "@/lib/referrals";
import { DEFAULT_LOCALE, isLocale } from "@/config/i18n";
import { formatReferralUrl } from "@/config/referrals";

const CREATE_SCHEMA = z.object({
  label: z.string().max(80).optional(),
  description: z.string().max(240).optional(),
  rewardPoints: z.number().int().min(0).max(5000).optional(),
  isActive: z.boolean().optional(),
  code: z.string().min(6).max(32).optional(),
});

function ensureSuperAdmin(session: Awaited<ReturnType<typeof getServerSession>>) {
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const roles = session.user.roles ?? [session.user.role];
  if (!roles.includes(Role.SUPERADMIN)) {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
  }
  return null;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const url = new URL(request.url);
  const candidateLang = url.searchParams.get("lang");
  const resolvedLang = isLocale(candidateLang) ? candidateLang : DEFAULT_LOCALE;
  const stats = await getUserReferralStats(session.user.id, resolvedLang);
  return NextResponse.json(stats);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const guard = ensureSuperAdmin(session);
  if (guard) return guard;

  const body = await request.json();
  const parsed = CREATE_SCHEMA.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join(", ") },
      { status: 400 }
    );
  }

  const created = await createReferralCode({
    createdById: session!.user!.id,
    label: parsed.data.label,
    description: parsed.data.description,
    rewardPoints: parsed.data.rewardPoints,
    isActive: parsed.data.isActive,
    code: parsed.data.code,
  });

  return NextResponse.json({
    ...created,
    shareUrl: formatReferralUrl(created.code, DEFAULT_LOCALE),
  });
}
