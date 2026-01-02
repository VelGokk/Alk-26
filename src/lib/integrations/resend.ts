import { Resend } from "resend";
import { hasEnv } from "@/lib/env";
import { logEvent } from "@/lib/logger";

export const isResendConfigured = hasEnv("RESEND_API_KEY") && hasEnv("RESEND_FROM");

const resend = isResendConfigured
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!isResendConfigured || !resend) {
    console.log("[email skipped]", { to, subject });
    return;
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM as string,
    to,
    subject,
    html,
  });

  await logEvent({
    action: "email.sent",
    message: `Email enviado a ${to}`,
  });
}
