import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPreference, isMercadoPagoConfigured } from "@/lib/integrations/mercadopago";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { logEvent } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMercadoPagoConfigured) {
    return NextResponse.json(
      { error: "Mercado Pago no configurado." },
      { status: 501 }
    );
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { course: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json(
      { error: "El carrito esta vacio." },
      { status: 400 }
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.course.price, 0);
  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      amount: total,
      currency: "ARS",
      metadata: { cartId: cart.id, courseIds: cart.items.map((item) => item.courseId) },
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  const localeBase = `${baseUrl}/${DEFAULT_LOCALE}`;

  const preference = await createPreference({
    items: cart.items.map((item) => ({
      title: item.course.title,
      quantity: item.quantity,
      unit_price: item.course.price,
    })),
    externalReference: payment.id,
    notificationUrl: `${baseUrl}/api/mercadopago/webhook`,
    backUrls: {
      success: `${localeBase}/checkout/success`,
      pending: `${localeBase}/checkout/pending`,
      failure: `${localeBase}/checkout/failure`,
    },
  });

  const currentMetadata = (payment.metadata ?? {}) as Record<string, unknown>;
  await prisma.payment.update({
    where: { id: payment.id },
    data: { metadata: { ...currentMetadata, preferenceId: preference.id } },
  });

  await logEvent({
    action: "payment.preference",
    message: `Preferencia creada ${payment.id}`,
    userId: session.user.id,
  });

  return NextResponse.json({ initPoint: preference.init_point });
}

