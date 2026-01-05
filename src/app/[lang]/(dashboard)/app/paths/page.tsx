import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import {
  getDictionary,
  isLocale,
  DEFAULT_LOCALE,
  type AppDictionary,
  type AppLocale,
} from "@/lib/i18n";
import {
  evaluateLearningPaths,
  type LearningPathEvaluation,
  type LearningPathSummary,
} from "@/config/learning-paths";
import { getProgramProgressSegments } from "@/lib/programs";

const SEGMENT_KEYS = ["observacion", "orden", "accion", "sostenimiento"] as const;

const defaultSummary: LearningPathSummary = {
  segments: SEGMENT_KEYS.map((key) => ({ key, percent: 0 })),
  overallPercent: 0,
};

const STATUS_LABELS = {
  locked: "learningPathStatusLocked",
  unlocked: "learningPathStatusUnlocked",
  complete: "learningPathStatusComplete",
} as const;

export default async function LearningPathsPage({
  params,
}: {
  params: { lang: string };
}) {
  await requireRole([Role.USER, Role.SUBSCRIBER, Role.SUPERADMIN]);
  const session = await getServerSession(authOptions);
  const resolvedLang: AppLocale = isLocale(params.lang)
    ? params.lang
    : DEFAULT_LOCALE;
  const dictionary = await getDictionary(resolvedLang);
  const dict = dictionary.dashboard;

  const enrollment = session?.user?.id
    ? await prisma.enrollment.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { program: true },
      })
    : null;

  const summary = enrollment
    ? await getProgramProgressSegments(enrollment.programId, session!.user.id)
    : defaultSummary;

  const evaluations = evaluateLearningPaths(summary);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {dict.learningPaths}
        </p>
        <h1 className="font-heading text-3xl">{dict.learningPathsTitle}</h1>
        <p className="text-sm text-zinc-600">{dict.learningPathsSubtitle}</p>
      </div>

      {!enrollment ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
          {dict.learningPathsEmpty}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {dict.learningPathsProgramLabel ?? "Programa"}
            </p>
            <p className="font-heading text-xl text-ink">
              {enrollment.program?.title}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {evaluations.map((evaluation) => (
              <PathCard
                key={evaluation.definition.id}
                evaluation={evaluation}
                dictionary={dictionary}
                lang={resolvedLang}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type PathCardProps = {
  evaluation: LearningPathEvaluation;
  dictionary: AppDictionary;
  lang: AppLocale;
};

function PathCard({ evaluation, dictionary, lang }: PathCardProps) {
  const { definition, status, completionRatio } = evaluation;
  const statusKey = STATUS_LABELS[status];
  const percent = Math.round(completionRatio * 100);
  const actionLabel = dictionary.dashboard[definition.recommendation.actionKey];

  const statusClasses = {
    locked: "border border-zinc-200 bg-zinc-50 text-zinc-400",
    unlocked: "border border-ink/30 bg-ink/5 text-ink",
    complete: "border border-emerald-300 bg-emerald-50 text-emerald-600",
  } as const;

  return (
    <article className={`rounded-2xl p-5 shadow-sm ${statusClasses[status]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em]">{dictionary.dashboard[definition.labelKey]}</p>
          <p className="text-sm text-zinc-500">{dictionary.dashboard[definition.descriptionKey]}</p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em]">{dictionary.dashboard[statusKey]}</span>
      </div>
      <div className="mt-4">
        <div className="h-1 rounded-full bg-white/50">
          <div
            className="h-full rounded-full bg-ink transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
          {percent}% completo
        </p>
      </div>
      <div className="mt-4 text-xs uppercase tracking-[0.3em]">
        <Link
          href={definition.recommendation.path(lang as AppLocale)}
          className="inline-flex items-center gap-2 text-ink transition hover:text-ink/70"
        >
          {actionLabel}
        </Link>
      </div>
    </article>
  );
}
