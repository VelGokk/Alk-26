import { Role } from "@prisma/client";
import { getCertificateById } from "@/lib/certificates";
import { requireRole } from "@/lib/auth/guards";
import { getDictionary, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

const formatDate = (value: Date | string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

type SegmentKey = "observacion" | "orden" | "accion" | "sostenimiento";

type CertificateMetadata = {
  segments?: {
    key: SegmentKey;
    completed: number;
    total: number;
    percent: number;
  }[];
  overallPercent?: number;
} | null;

export default async function CertificateDetail({
  params,
}: {
  params: { lang: string; certificateId: string };
}) {
  const resolvedLang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(resolvedLang);
  const session = await requireRole([Role.USER, Role.SUBSCRIBER, Role.SUPERADMIN]);
  const certificate = await getCertificateById(params.certificateId);

  if (
    !certificate ||
    (certificate.userId !== session.user.id && session.user.role !== Role.SUPERADMIN)
  ) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
        {dictionary.dashboard.certificateUnavailable}
      </div>
    );
  }

  const metadata = certificate.metadata as CertificateMetadata;
  const segments = metadata?.segments ?? [];
  const overallPercent = metadata?.overallPercent ?? 0;
  const phaseLabels: Record<SegmentKey, string> = {
    observacion: dictionary.education.programPhaseDISCOVERY,
    orden: dictionary.education.programPhaseORDEN,
    accion: dictionary.education.programPhaseACCION,
    sostenimiento: dictionary.education.programPhaseSUSTAINMENT,
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {dictionary.dashboard.certificateDetailHeading}
        </p>
        <h1 className="font-heading text-3xl">{certificate.program.title}</h1>
        <p className="text-sm text-zinc-600">
          {dictionary.dashboard.certificateDetailSubheading}
        </p>
      </div>
      <div className="glass-panel space-y-6 rounded-2xl border border-white/5 p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {dictionary.dashboard.certificateNumber}
            </p>
            <p className="font-heading text-2xl text-ink">
              {certificate.certificateNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {dictionary.dashboard.certificateIssuedOn}
            </p>
            <p className="font-heading text-2xl">
              {formatDate(certificate.issuedAt, resolvedLang)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {dictionary.dashboard.certificateDetailOverall}
            </p>
            <p className="font-heading text-5xl text-ink">{overallPercent}%</p>
          </div>
          <a
            href={`/api/certificates/${certificate.id}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-ink/80"
          >
            {dictionary.dashboard.certificateDownload}
          </a>
        </div>
        <p className="text-xs text-zinc-500">
          {dictionary.dashboard.certificateDetailMetaHint}
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl">
            {dictionary.dashboard.certificateDetailSegments}
          </h2>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {certificate.user?.name ?? certificate.user?.email ?? ""}
          </p>
        </div>
        {segments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
            {dictionary.dashboard.certificateSegmentsEmpty}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {segments.map((segment) => (
              <div
                key={segment.key}
                className="rounded-2xl border border-white/5 p-4 text-sm text-zinc-600"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {phaseLabels[segment.key]}
                </p>
                <p className="font-heading text-3xl text-ink">
                  {segment.percent}%
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {segment.completed}/{segment.total}{" "}
                  {dictionary.education.programLessonsLabel}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
