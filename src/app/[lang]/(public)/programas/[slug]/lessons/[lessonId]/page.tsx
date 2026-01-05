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
import { getProgramLessonById, getUserProgramEnrollment } from "@/lib/programs";
import { notFound } from "next/navigation";
import { paths } from "@/lib/paths";
import ProgramLessonCompleteButton from "@/components/public/ProgramLessonCompleteButton";
import LessonComments from "@/components/public/LessonComments";
import { prisma } from "@/lib/prisma";

export default async function ProgramLessonPage({
  params,
}: {
  params: Promise<{ lang: AppLocale; slug: string; lessonId: string }>;
}) {
  const resolvedParams = await params;
  const lang = isLocale(resolvedParams.lang)
    ? resolvedParams.lang
    : DEFAULT_LOCALE;
  const dictionary = await getDictionary(lang);
  const translate = createTranslator(dictionary);

  const lesson = await getProgramLessonById(resolvedParams.lessonId);
  if (
    !lesson ||
    lesson.module.program.slug !== resolvedParams.slug ||
    !lesson.module.program.published
  ) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const enrollment =
    session?.user?.id &&
    (await getUserProgramEnrollment(
      lesson.module.programId,
      session.user.id
    ));
  const lessonCompleted = enrollment?.progress.some(
    (item) => item.lessonId === lesson.id && item.completed
  );

  const commentsRaw = await prisma.comment.findMany({
    where: {
      lessonId: lesson.id,
      isHidden: false,
      isDeleted: false,
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  const comments = commentsRaw.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    user: {
      id: comment.user.id,
      name: comment.user.name,
      email: comment.user.email,
    },
  }));

  return (
    <div className="space-y-10">
      <section className="glass-panel rounded-3xl border border-black/10 bg-white/90 p-8 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {lesson.module.program.title}
            </p>
            <h1 className="font-heading text-4xl text-ink">{lesson.title}</h1>
          </div>
          <div className="space-y-1 text-right text-xs uppercase tracking-[0.3em] text-slate-500">
            <Link
              href={paths.public.program(lang, lesson.module.program.slug)}
              className="text-ink underline"
            >
              {translate("education.programsTitle")}
            </Link>
            <span>
              {lesson.module.lessons.length}{" "}
              {translate("education.programLessonsLabel")}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <article className="space-y-6">
          {lesson.videoUrl ? (
            <div className="relative h-[300px] overflow-hidden rounded-3xl border border-black/10 bg-black">
              <iframe
                title={lesson.title}
                src={lesson.videoUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
          {lesson.content ? (
            <div className="glass-panel rounded-3xl border border-black/10 bg-white/80 p-6 text-sm text-slate-700 shadow-soft">
              <div
                className="space-y-4"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </div>
          ) : null}
          {enrollment ? (
            <ProgramLessonCompleteButton
              lessonId={lesson.id}
              completed={Boolean(lessonCompleted)}
              label={translate("education.programLessonComplete")}
              completedLabel={translate("education.programLessonCompleted")}
            />
          ) : (
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {translate("education.programLessonEnrollNotice")}
            </p>
          )}
        </article>

        <aside className="space-y-6">
          <div className="glass-panel rounded-3xl border border-black/10 bg-white/80 p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {translate("education.programLessonResources")}
            </p>
            <div className="space-y-3 pt-4">
              {lesson.resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/70 px-4 py-3 text-sm transition hover:border-ink hover:text-ink"
                >
                  <div>
                    <p className="font-semibold">{resource.title}</p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                      {resource.type}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {translate("education.download")}
                  </span>
                </a>
              ))}
              {lesson.resources.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {translate("education.programLessonResourcesEmpty")}
                </p>
              ) : null}
            </div>
          </div>
        </aside>
      </section>
      <LessonComments
        lang={lang}
        lessonId={lesson.id}
        lessonSlug={lesson.module.program.slug}
        comments={comments}
        translate={translate}
        sessionUser={session?.user ?? null}
      />
    </div>
  );
}
