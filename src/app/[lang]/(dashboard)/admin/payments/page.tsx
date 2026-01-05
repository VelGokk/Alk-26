"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role, PaymentStatus } from "@prisma/client";
import { createTranslator, getDictionary, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

type PaymentsPageProps = {
  params: { lang: string };
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "dashboard.paymentStatusPending",
  PROCESSING: "dashboard.paymentStatusProcessing",
  APPROVED: "dashboard.paymentStatusApproved",
  FAILED: "dashboard.paymentStatusFailed",
  REFUNDED: "dashboard.paymentStatusRefunded",
  CANCELLED: "dashboard.paymentStatusCancelled",
};

export default async function AdminPaymentsPage({ params }: PaymentsPageProps) {
  const lang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(lang);
  const translate = createTranslator(dictionary);

  await requireRole([Role.ADMIN, Role.SUPERADMIN]);

  const payments = await prisma.payment.findMany({
    take: 40,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      webhookEvents: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const title = translate("dashboard.paymentsTitle");
  const emptyLabel = translate("dashboard.paymentsEmpty");

  const formatAmount = (amount: number, currency?: string) => {
    const formatter = new Intl.NumberFormat(lang, {
      style: "currency",
      currency: currency ?? "ARS",
    });
    return formatter.format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {translate("dashboard.payments")}
        </p>
        <h1 className="font-heading text-3xl">{title}</h1>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
          {emptyLabel}
        </div>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => {
            const metadata = (payment.metadata ?? {}) as {
              courseIds?: string[];
              preferenceId?: string;
            };
            const event = payment.webhookEvents[0];
            const statusLabel =
              STATUS_LABELS[payment.status] ?? "dashboard.paymentStatusUnknown";
            return (
              <article
                key={payment.id}
                className="glass-panel rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-zinc-500">
                    {translate("dashboard.paymentsCreated")}:{" "}
                    {new Date(payment.createdAt).toLocaleString(lang)}
                  </p>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {translate(statusLabel)}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <p className="font-heading text-xl text-ink">
                    {formatAmount(payment.amount, payment.currency)}
                  </p>
                  <p className="text-sm text-slate-600">
                    {translate("dashboard.paymentsUser")}:{" "}
                    {payment.user.name ?? payment.user.email}
                  </p>
                  <p className="text-sm text-slate-600">
                    {translate("dashboard.paymentsProvider")}: {payment.provider}
                  </p>
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  <p>
                    {translate("dashboard.paymentsReference")}:{" "}
                    {payment.providerPaymentId ?? translate("dashboard.paymentsPending")}
                  </p>
                  {metadata.preferenceId ? (
                    <p>
                      {translate("dashboard.paymentsPreference")}:{" "}
                      {metadata.preferenceId}
                    </p>
                  ) : null}
                  {metadata.courseIds?.length ? (
                    <p>
                      {translate("dashboard.paymentsCourses")}:{" "}
                      {metadata.courseIds.join(", ")}
                    </p>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-slate-500">
                  <span>
                    {translate("dashboard.paymentsWebhook")}{" "}
                    {event
                      ? new Date(event.createdAt).toLocaleString(lang)
                      : translate("dashboard.paymentsWebhookMissing")}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
