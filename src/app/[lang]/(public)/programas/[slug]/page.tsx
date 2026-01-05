import Link from "next/link";
import { getServerSession } from "next-auth";
import type { AppLocale } from "@/lib/i18n";
import {
  createTranslator,
  getDictionary,
  isLocale,
  DEFAULT_LOCALE,
} from "@/lib/i18n";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getProgramBySlug, getUserProgramEnrollment } from "@/lib/programs";
import { paths } from "@/lib/paths";
import { ProgramPhase } from "@prisma/client";
import ProgramEnrollButton from "@/components/public/ProgramEnrollButton";
import OntologicalRing from "@/components/ontological/OntologicalRing";
import OntologicalLogEditor from "@/components/ontological/OntologicalLogEditor";
import { getUserOntologicalLog } from "@/lib/ontological-logs";
import { isOpenAIConfigured } from "@/lib/integrations/openai";

type FormatReplacements = Record<string, string>;

function formatText(template: string, replacements: FormatReplacements) {
  return Object.entries(replacements).reduce(
    (value, [key, replacement]) =>
      value.replace(new RegExp(`\\{${key}\\}`, "g"), replacement),
    template
  );
}

const PHASE_LABELS: Record<ProgramPhase, string> = {
  DISCOVERY: "education.programPhaseDISCOVERY",
  PRACTICE: "education.programPhasePRACTICE",
  SUSTAINMENT: "education.programPhaseSUSTAINMENT",
};

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ lang: AppLocale; slug: string }>;
}) {
  const resolvedParams = await params;
  const lang = isLocale(resolvedParams.lang)
    ? resolvedParams.lang
    : DEFAULT_LOCALE;
  const dictionary = await getDictionary(lang);
  const translate = createTranslator(dictionary);
  const program = await getProgramBySlug(resolvedParams.slug);
  if (!program || !program.published) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const enrollment =
    session?.user?.id &&
    (await getUserProgramEnrollment(program.id, session.user.id));
  const log =
    session?.user?.id &&
    (await getUserOntologicalLog(program.id, session.user.id));
  const canUseAI = isOpenAIConfigured;
  const completedLessons = new Set(
    enrollment?.progress
      .filter((entry) => entry.completed)
      .map((entry) => entry.lessonId) ?? []
  );
  return (
    <div className="space-y-10">
      <section className="glass-panel relative overflow-hidden rounded-3xl border border-black/10 bg-white/80 p-10 shadow-soft backdrop-blur">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                {program.strapline ?? translate("education.programDetailHeroKicker")}
              </p>
              <h1 className="font-heading text-4xl text-ink sm:text-5xl">
                {program.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {program.tagRelations.map((relation) => (
                <span
                  key={relation.tag.id}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-600"
                >
                  {relation.tag.name}
                </span>
              ))}
            </div>
          </div>
          {program.summary ? (
            <p className="max-w-4xl text-sm text-slate-600">
              {program.summary}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
            {program.duration ? (
              <span>Duración: {program.duration}</span>
            ) : null}
            {program.intensity ? (
              <>
                <span className="text-slate-200">/</span>
                <span>Formato: {program.intensity}</span>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="space-y-6">
          {program.modules.map((module) => (
            <section
              key={module.id}
              className="glass-panel rounded-3xl border border-black/10 bg-white/80 p-6 shadow-soft"
            >
              <header className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {translate(PHASE_LABELS[module.phase])}
                </p>
                <h2 className="font-heading text-2xl text-ink">{module.title}</h2>
                {module.summary ? (
                  <p className="text-sm text-slate-600">{module.summary}</p>
                ) : null}
              </header>
              <div className="space-y-3">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <Link
                          href={paths.public.programLesson(
                            lang,
                            program.slug,
                            lesson.id
                          )}
                          className="font-semibold text-ink"
                        >
                          {lesson.title}
                        </Link>
                        {lesson.summary ? (
                          <p className="text-sm text-slate-600">
                            {lesson.summary}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                          <span>
                            {formatText(
                              translate("education.programLessonDuration"),
                              {
                                minutes: String(lesson.durationMin ?? 0),
                              }
                            )}
                          </span>
                          <span>
                            {lesson.resources.length}{" "}
                            {translate("education.programLessonResources")}
                          </span>
                        </div>
                      </div>
                      {completedLessons.has(lesson.id) ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                          {translate("education.programLessonCompleted")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </article>

        <aside className="space-y-6">
          <div className="glass-panel rounded-3xl border border-black/10 bg-white/80 p-6 shadow-soft">
            <OntologicalRing
              programId={program.id}
              lang={lang}
              size={220}
              className="w-full"
            />
          </div>

          <div className="glass-panel rounded-3xl border border-black/10 bg-white/80 p-6 shadow-soft">
            {session?.user?.id ? (
              <OntologicalLogEditor
                programId={program.id}
                initialLogId={log?.id}
                initialContent={log?.content ?? ""}
                initialIsPrivate={Boolean(log?.isPrivate)}
                canUseAI={canUseAI}
              />
            ) : (
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Iniciá sesión para escribir tu bitácora y pedir espejo.
              </p>
            )}
          </div>

          <div className="glass-panel rounded-3xl border border-black/10 bg-white/80 p-6 shadow-soft">
            {enrollment ? (
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink">
                {translate("education.programDetailEnrolled")}
              </p>
            ) : (
              <ProgramEnrollButton
                slug={program.slug}
                label={translate("education.programDetailEnroll")}
                successLabel={translate("education.programDetailEnrolled")}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
