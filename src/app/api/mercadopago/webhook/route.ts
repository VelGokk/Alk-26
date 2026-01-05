import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchPayment, isMercadoPagoConfigured } from "@/lib/integrations/mercadopago";
import { PaymentStatus } from "@prisma/client";
import { logEvent } from "@/lib/logger";
import { deliverEmail } from "@/lib/email";
import { paymentReceiptTemplate } from "@/emails/templates/transactional";
import { auditEvent } from "@/lib/audit";

type WebhookPayload = Record<string, unknown>;

export const runtime = "nodejs";

function mapStatus(status?: string | null) {
  switch (status) {
    case "approved":
      return PaymentStatus.APPROVED;
    case "in_process":
    case "pending":
    case "authorized":
      return PaymentStatus.PROCESSING;
    case "rejected":
      return PaymentStatus.FAILED;
    case "cancelled":
      return PaymentStatus.CANCELLED;
    case "refunded":
    case "charged_back":
      return PaymentStatus.REFUNDED;
    default:
      return PaymentStatus.PROCESSING;
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

  const idempotencyKey =
    request.headers.get("x-idempotency-key") ??
    request.headers.get("X-Idempotency-Key") ??
    undefined;

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

  const providerEventId = String(paymentInfo.id ?? paymentId);
  if (idempotencyKey) {
    const existing = await prisma.paymentWebhookEvent.findUnique({
      where: { idempotencyKey },
    });
    if (existing) {
      return NextResponse.json({
        status: "duplicate",
        existingStatus: existing.status,
      });
    }
  }
  const existingEvent = await prisma.paymentWebhookEvent.findUnique({
    where: { providerEventId },
  });
  if (existingEvent) {
    return NextResponse.json({
      status: "duplicate",
      existingStatus: existingEvent.status,
    });
  }

  const payload: Prisma.InputJsonValue =
    (body as Prisma.InputJsonValue) ?? Prisma.JsonNull;
  try {
    await prisma.paymentWebhookEvent.create({
      data: {
        paymentId: payment.id,
        providerEventId,
        idempotencyKey,
        status,
        payload,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ status: "duplicate" });
    }
    throw error;
  }

  const currentMetadata = (payment.metadata ?? {}) as Record<string, unknown>;
  const mergedMetadata = {
    ...currentMetadata,
    provider: paymentInfo,
  };

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status,
      providerPaymentId: String(paymentId),
      metadata: mergedMetadata as Prisma.InputJsonValue,
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
      const purchasedCourses =
        courseIds.length > 0
          ? await prisma.course.findMany({
              where: { id: { in: courseIds } },
              select: { title: true },
            })
          : [];
      await deliverEmail({
        to: user.email,
        subject: "Pago aprobado",
        html: paymentReceiptTemplate({
          nombre: user.name ?? user.email ?? "Alkaya User",
          cursos: purchasedCourses.map((course) => course.title),
          monto: payment.amount,
          currency: payment.currency,
        }),
      });
    }
  }

  await logEvent({
    action: "payment.webhook",
    message: `Webhook ${paymentId} -> ${status}`,
    userId: payment.userId,
  });

  await auditEvent({
    action: "payment.webhook",
    userId: payment.userId,
    resourceType: "Payment",
    resourceId: payment.id,
    status: status,
    source: "mercadopago",
    ip: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
    metadata: {
      paymentId,
      idempotencyKey,
      providerStatus: paymentInfo.status,
    },
  });

  return NextResponse.json({ status: "ok" });
}
