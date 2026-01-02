import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchPayment, isMercadoPagoConfigured } from "@/lib/integrations/mercadopago";
import { PaymentStatus } from "@prisma/client";
import { logEvent } from "@/lib/logger";
import { sendEmail } from "@/lib/integrations/resend";

export const runtime = "nodejs";

function mapStatus(status?: string | null) {
  switch (status) {
    case "approved":
      return PaymentStatus.APPROVED;
    case "in_process":
    case "pending":
    case "authorized":
      return PaymentStatus.PENDING;
    case "rejected":
    case "cancelled":
      return PaymentStatus.FAILED;
    case "refunded":
    case "charged_back":
      return PaymentStatus.REFUNDED;
    default:
      return PaymentStatus.PENDING;
  }
}

export async function POST(request: Request) {
  if (!isMercadoPagoConfigured) {
    return NextResponse.json({ status: "ignored" });
  }

  const body = await request.json().catch(() => ({}));
  const searchParams = new URL(request.url).searchParams;
  const paymentId =
    body?.data?.id ||
    searchParams.get("data.id") ||
    searchParams.get("id");

  if (!paymentId) {
    return NextResponse.json({ status: "missing_payment_id" });
  }

  const paymentInfo = await fetchPayment(String(paymentId));
  const externalReference = paymentInfo.external_reference as string | undefined;
  const status = mapStatus(paymentInfo.status as string | null);

  if (!externalReference) {
    return NextResponse.json({ status: "missing_reference" });
  }

  const payment = await prisma.payment.findUnique({
    where: { id: externalReference },
  });

  if (!payment) {
    return NextResponse.json({ status: "unknown_payment" });
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status,
      providerPaymentId: String(paymentId),
      metadata: paymentInfo,
    },
  });

  if (status === PaymentStatus.APPROVED) {
    const courseIds =
      (payment.metadata as { courseIds?: string[] } | null)?.courseIds ?? [];
    for (const courseId of courseIds) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: payment.userId, courseId } },
        update: { status: "ACTIVE", paymentId: payment.id },
        create: {
          userId: payment.userId,
          courseId,
          paymentId: payment.id,
        },
      });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: payment.userId },
    });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    const user = await prisma.user.findUnique({ where: { id: payment.userId } });
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "Compra confirmada",
        html: `<p>Tu compra en ALKAYA fue aprobada. Ya podés acceder a tus cursos.</p>`,
      });
    }
  }

  await logEvent({
    action: "payment.webhook",
    message: `Webhook ${paymentId} -> ${status}`,
    userId: payment.userId,
  });

  return NextResponse.json({ status: "ok" });
}
