import Link from "next/link";
import { Role } from "@prisma/client";
import { getCertificatesForUser } from "@/lib/certificates";
import { requireRole } from "@/lib/auth/guards";
import { getDictionary, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

const formatDate = (value: Date | string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

export default async function CertificatesPage({
  params,
}: {
  params: { lang: string };
}) {
  const resolvedLang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(resolvedLang);
  const session = await requireRole([Role.USER, Role.SUBSCRIBER, Role.SUPERADMIN]);
  const certificates = await getCertificatesForUser(session.user.id);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
          {dictionary.dashboard.certificateListTitle}
        </p>
        <h1 className="font-heading text-3xl">
          {dictionary.dashboard.certificateListTitle}
        </h1>
        <p className="text-sm text-zinc-600">
          {dictionary.dashboard.certificateListSubtitle}
        </p>
      </div>
      {certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
          {dictionary.dashboard.certificateListEmpty}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map((certificate) => {
            const overallPercent = (
              ((certificate.metadata as { overallPercent?: number } | null)
                ?.overallPercent ?? 0)
            ).toFixed(0);
            return (
              <article
                key={certificate.id}
                className="glass-panel space-y-4 rounded-2xl border border-white/5 p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-heading text-xl">
                      {certificate.program.title}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      {dictionary.dashboard.certificateIssuedOn} {formatDate(
                        certificate.issuedAt,
                        resolvedLang
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end text-right text-xs uppercase tracking-[0.3em] text-zinc-500">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/80">
                      {overallPercent}%
                    </span>
                    <span>{dictionary.dashboard.certificateProgressLabel}</span>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-zinc-600">
                  <p>
                    <span className="font-semibold text-zinc-900">
                      {dictionary.dashboard.certificateNumber}:
                    </span>{" "}
                    {certificate.certificateNumber}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em]">
                  <Link
                    href={`/${resolvedLang}/app/certificates/${certificate.id}`}
                    className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-ink"
                  >
                    {dictionary.dashboard.certificateViewDetail}
                  </Link>
                  <a
                    href={`/api/certificates/${certificate.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-ink px-4 py-2 text-white transition hover:bg-ink/80"
                  >
                    {dictionary.dashboard.certificateDownload}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
