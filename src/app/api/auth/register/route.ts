import { NextResponse } from "next/server";
import { z } from "zod";
import { LogLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { logEvent } from "@/lib/logger";
import { sendEmail } from "@/lib/integrations/resend";
import { applyReferralCodeForUser } from "@/lib/referrals";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  referralCode: z.string().min(4).max(32).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos." }, { status: 400 });
  }

  const { name, email, password, referralCode } = parsed.data;
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    return NextResponse.json(
      { error: "El email ya esta registrado." },
      { status: 400 }
    );
  }

  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
    },
  });

  if (referralCode) {
    try {
      const result = await applyReferralCodeForUser({
        referralCode,
        referredUserId: user.id,
        referredEmail: user.email,
      });
      if (result) {
        await logEvent({
          action: "referral.register",
          message: `Codigo ${referralCode.toUpperCase()} aplicado para ${user.email}`,
          userId: user.id,
          meta: {
            refererReward: result.refererReward,
            refereeReward: result.refereeReward,
          },
        });
      }
    } catch (error) {
      await logEvent({
        action: "referral.error",
        level: LogLevel.WARN,
        message: `Error al aplicar codigo ${referralCode} para ${user.email}`,
        userId: user.id,
        meta: {
          error: (error as Error)?.message,
        },
      });
    }
  }

  await logEvent({
    action: "auth.register",
    message: `Nuevo registro ${user.email}`,
    userId: user.id,
  });

  await sendEmail({
    to: user.email,
    subject: "Bienvenido a ALKAYA",
    html: `<p>Hola ${user.name ?? ""}, bienvenido a ALKAYA LMS.</p>`,
  });

  return NextResponse.json({ success: true });
}

