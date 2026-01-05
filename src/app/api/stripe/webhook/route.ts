import { Prisma, PaymentProvider, PaymentStatus } from "@prisma/client";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, getStripeWebhookSecret, isStripeConfigured } from "@/lib/integrations/stripe";
import { logEvent } from "@/lib/logger";
import { deliverEmail } from "@/lib/email";
import { paymentReceiptTemplate } from "@/emails/templates/transactional";
import { auditEvent } from "@/lib/audit";

export const runtime = "nodejs";

function mapEventToStatus(type: Stripe.Event["type"]): PaymentStatus {
  switch (type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "payment_intent.succeeded":
      return PaymentStatus.APPROVED;
    case "checkout.session.async_payment_failed":
    case "payment_intent.payment_failed":
      return PaymentStatus.FAILED;
    case "charge.refunded":
    case "charge.refund.updated":
      return PaymentStatus.REFUNDED;
    case "charge.dispute.closed":
    case "charge.dispute.created":
      return PaymentStatus.CANCELLED;
    default:
      return PaymentStatus.PROCESSING;
  }
}

export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json({ status: "ignored" });
  }

  const signature = request.headers.get("stripe-signature");
  const webhookSecret = getStripeWebhookSecret();
  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { status: "missing_signature" },
      { status: 400 }
    );
  }

  const payload = await request.text();
  let event: Stripe.Event;
  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { status: "invalid_signature", error: (error as Error).message },
      { status: 400 }
    );
  }

  const eventObject = event.data.object as Stripe.Event.Data.Object & Record<string, unknown>;
  const metadata = (eventObject.metadata ?? {}) as Record<string, string>;
  const paymentId = metadata.paymentId ?? (eventObject.client_reference_id as string);

  if (!paymentId) {
    return NextResponse.json({ status: "missing_reference" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.provider !== PaymentProvider.STRIPE) {
    return NextResponse.json({ status: "unknown_payment" }, { status: 404 });
  }

  const providerEventId = event.id;
  const idempotencyKey =
    request.headers.get("stripe-idempotency-key") ??
    request.headers.get("idempotency-key") ??
    undefined;

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

  const status = mapEventToStatus(event.type);
  const parsedPayload = JSON.parse(payload) as Prisma.InputJsonValue;

  await prisma.paymentWebhookEvent.create({
    data: {
      paymentId: payment.id,
      providerEventId,
      idempotencyKey,
      status,
      payload: parsedPayload,
    },
  });

  const providerPaymentId =
    (eventObject.payment_intent as string | undefined) ?? eventObject.id;
  const currentMetadata = (payment.metadata ?? {}) as Record<string, unknown>;
  const stripeMeta =
    (currentMetadata.stripe as Record<string, unknown> | undefined) ?? {};

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status,
      providerPaymentId: providerPaymentId ?? payment.providerPaymentId,
      metadata: {
        ...currentMetadata,
        stripe: {
          ...stripeMeta,
          lastEvent: {
            id: event.id,
            type: event.type,
            paymentIntent: eventObject.payment_intent ?? null,
          },
        },
      } as Prisma.InputJsonObject,
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
    message: `Stripe webhook ${providerEventId} -> ${status}`,
    userId: payment.userId,
  });

  await auditEvent({
    action: "payment.webhook",
    userId: payment.userId,
    resourceType: "Payment",
    resourceId: payment.id,
    status,
    source: "stripe",
    ip:
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
    metadata: {
      event: event.type,
      idempotencyKey,
      paymentIntent: eventObject.payment_intent,
    },
  });

  return NextResponse.json({ status: "ok" });
}
