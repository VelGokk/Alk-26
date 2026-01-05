import { Prisma, PaymentProvider } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { logEvent } from "@/lib/logger";
import { getStripe, isStripeConfigured } from "@/lib/integrations/stripe";

export const runtime = "nodejs";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Stripe no configurado." }, { status: 501 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { course: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.course.price * item.quantity,
    0
  );

  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      amount: total,
      currency: "ARS",
      provider: PaymentProvider.STRIPE,
      metadata: {
        cartId: cart.id,
        courseIds: cart.items.map((item) => item.courseId),
      },
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  const localeBase = `${baseUrl}/${DEFAULT_LOCALE}`;

  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${localeBase}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${localeBase}/checkout/failure`,
    line_items: cart.items.map((item) => ({
      price_data: {
        currency: item.course.currency ?? "ARS",
        product_data: {
          name: item.course.title,
        },
        unit_amount: Math.max(item.course.price, 0) * 100,
      },
      quantity: item.quantity,
    })),
    metadata: {
      paymentId: payment.id,
    },
    customer_email: session.user.email ?? undefined,
    client_reference_id: payment.id,
  });

  if (!checkoutSession.url) {
    return NextResponse.json(
      { error: "No se pudo generar la sesión de pago." },
      { status: 500 }
    );
  }

  const currentMetadata = (payment.metadata ?? {}) as Record<string, unknown>;
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      metadata: {
        ...currentMetadata,
        stripeSessionId: checkoutSession.id,
        stripeUrl: checkoutSession.url,
      } as Prisma.InputJsonObject,
    },
  });

  await logEvent({
    action: "payment.checkout",
    message: `Stripe checkout creado ${payment.id}`,
    userId: session.user.id,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
