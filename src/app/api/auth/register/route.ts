import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { logEvent } from "@/lib/logger";
import { sendEmail } from "@/lib/integrations/resend";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const { name, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    return NextResponse.json(
      { error: "El email ya está registrado." },
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
