"use server";

import { Prisma } from "@prisma/client";
import { sendEmail } from "@/lib/integrations/resend";
import { prisma } from "@/lib/prisma";
import { logEvent } from "@/lib/logger";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  metadata?: Record<string, unknown>;
};

export async function deliverEmail(payload: EmailPayload) {
  try {
    await sendEmail(payload);
    return true;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";
    await logEvent({
      action: "email.failed",
      message: `Email failure to ${payload.to}: ${message}`,
      meta: {
        subject: payload.subject,
        ...payload.metadata,
      },
    });

    await prisma.emailRetry.create({
      data: {
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        attempts: 1,
        lastError: message,
        nextAttemptAt: new Date(Date.now() + 5 * 60_000),
        metadata: payload.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    return false;
  }
}
