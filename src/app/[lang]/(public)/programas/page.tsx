import Link from "next/link";
import type { AppLocale } from "@/lib/i18n";
import { createTranslator, getDictionary, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { paths } from "@/lib/paths";
import { getProgramCatalog } from "@/lib/programs";

type FormatReplacements = Record<string, string>;

function formatText(template: string, replacements: FormatReplacements) {
  return Object.entries(replacements).reduce(
    (value, [key, replacement]) =>
      value.replace(new RegExp(`\\{${key}\\}`, "g"), replacement),
    template
  );
}

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ lang: AppLocale }>;
}) {
  const resolvedParams = await params;
  const lang = isLocale(resolvedParams.lang)
    ? resolvedParams.lang
    : DEFAULT_LOCALE;
  const dictionary = await getDictionary(lang);
  const translate = createTranslator(dictionary);
  const programs = await getProgramCatalog();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-deep p-10 text-white shadow-glow sm:p-12">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-alkaya/30 blur-3xl animate-float" />
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            {translate("education.programDetailHeroKicker")}
          </p>
          <h1 className="font-heading text-3xl leading-tight tracking-tight sm:text-5xl">
            {translate("education.programsTitle")}
          </h1>
          <p className="max-w-3xl text-sm text-white/80">
            {translate("education.programsSubtitle")}
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {programs.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-black/10 p-6 text-sm text-slate-500">
            {translate("education.programsEmpty")}
          </div>
        ) : (
          programs.map((program) => {
            const lessonCount = program.modules.reduce(
              (total, module) => total + module.lessons.length,
              0
            );
            const tags = program.tagRelations
              .slice(0, 3)
              .map((relation) => relation.tag.name);
            const lessonsText = formatText(translate("education.programCardLessons"), {
              count: String(lessonCount),
            });
            const durationText = formatText(
              translate("education.programCardDuration"),
              {
                duration: program.duration ?? "—",
              }
            );
            return (
              <article
                key={program.id}
                className="relative overflow-hidden rounded-3xl border border-black/5 bg-white/70 p-6 shadow-soft backdrop-blur"
              >
                {program.heroImage ? (
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `url(${program.heroImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : null}
                <div className="relative space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                    <span>{durationText}</span>
                    {program.intensity ? (
                      <>
                        <span className="text-slate-200">/</span>
                        <span>{program.intensity}</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="font-heading text-2xl text-deep">
                    {program.title}
                  </h2>
                  {program.summary ? (
                    <p className="text-sm text-slate-600">{program.summary}</p>
                  ) : null}
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {lessonsText}
                  </div>
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={`${program.id}-${tag}`}
                          className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <Link
                    href={paths.public.program(lang, program.slug)}
                    className="inline-flex rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-ink transition hover:border-ink hover:text-ink"
                  >
                    {translate("education.programCardAction")}
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
