import { prisma } from "@/lib/prisma";
import { addResource, createLesson, createModule } from "@/lib/actions/instructor";
import { submitLessonForReview } from "@/lib/actions/contentReview";
import UploadField from "@/components/public/UploadField";
import { requireRole } from "@/lib/auth/guards";
import { Role, type ContentReviewState } from "@prisma/client";
import {
  createTranslator,
  getDictionary,
  isLocale,
  DEFAULT_LOCALE,
} from "@/lib/i18n";
import { REVIEW_STATUSES } from "@/config/review";

export default async function CourseModulesPage({
  params,
}: {
  params: { lang: string; courseId: string };
}) {
  await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const resolvedLang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(resolvedLang);
  const translate = createTranslator(dictionary);

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              contentReviews: {
                orderBy: { updatedAt: "desc" },
                take: 1,
              },
            },
          },
        },
      },
      resources: true,
    },
  });

  if (!course) {
    return <div className="text-sm text-zinc-600">Curso no encontrado.</div>;
  }

  const getStatusLabel = (status?: ContentReviewState) => {
    if (!status) return null;
    const config = REVIEW_STATUSES.find((entry) => entry.id === status);
    if (!config) return status;
    return translate(config.labelKey);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Módulos y lecciones
        </p>
        <h1 className="font-heading text-3xl">{course.title}</h1>
      </div>

      <form action={createModule} className="glass-panel rounded-2xl p-6 space-y-3">
        <input type="hidden" name="courseId" value={course.id} />
        <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Nuevo módulo
        </label>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            name="title"
            placeholder="Título del módulo"
            className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
          >
            Crear módulo
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {course.modules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
            Agrega módulos para empezar a cargar lecciones.
          </div>
        ) : (
          course.modules.map((module) => (
            <div key={module.id} className="glass-panel rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Módulo
                </p>
                <h2 className="font-heading text-xl">{module.title}</h2>
              </div>
              <form action={createLesson} className="space-y-2">
                <input type="hidden" name="moduleId" value={module.id} />
                <div className="grid gap-3 md:grid-cols-3">
                  <input
                    name="title"
                    placeholder="Título de la lección"
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
                  />
                  <input
                    name="content"
                    placeholder="Contenido breve"
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
                  />
                  <select
                    name="contentType"
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
                  >
                    <option value="TEXT">Texto</option>
                    <option value="VIDEO">Video</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="LIVE">Live</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="rounded-full border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.2em]"
                >
                  Agregar lección
                </button>
              </form>

              <div className="space-y-2">
                {module.lessons.length === 0 ? (
                  <p className="text-sm text-zinc-600">
                    Este módulo todavía no tiene lecciones.
                  </p>
                ) : (
                  module.lessons.map((lesson) => {
                    const latestReview = lesson.contentReviews?.[0];
                    return (
                      <div
                        key={lesson.id}
                        className="space-y-2 rounded-xl border border-black/5 px-4 py-3"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold">{lesson.title}</p>
                            {latestReview && (
                              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                {getStatusLabel(latestReview.status)}
                              </p>
                            )}
                          </div>
                          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                            {lesson.contentType}
                          </span>
                        </div>
                        {latestReview?.summary && (
                          <p className="text-sm text-zinc-600">
                            <span className="font-semibold">
                              {translate("dashboard.reviewSummaryLabel")}:{" "}
                            </span>
                            {latestReview.summary}
                          </p>
                        )}
                        <form action={submitLessonForReview} className="space-y-2">
                          <input type="hidden" name="lessonId" value={lesson.id} />
                          <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                            {translate("dashboard.reviewSummaryLabel")}
                          </label>
                          <textarea
                            name="summary"
                            placeholder={translate("dashboard.reviewFeedbackPlaceholder")}
                            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
                          />
                          <button
                            type="submit"
                            className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
                          >
                            {translate("dashboard.reviewActionStart")}
                          </button>
                        </form>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h2 className="font-heading text-xl">Recursos del curso</h2>
        <form action={addResource} className="space-y-3">
          <input type="hidden" name="courseId" value={course.id} />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              name="title"
              placeholder="Titulo del recurso"
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            />
            <select
              name="type"
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            >
              <option value="PDF">PDF</option>
              <option value="IMAGE">Imagen</option>
              <option value="VIDEO">Video</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
          <UploadField name="url" label="Subi o pega URL" />
          <button
            type="submit"
            className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
          >
            Agregar recurso
          </button>
        </form>

        {course.resources.length === 0 ? (
          <p className="text-sm text-zinc-600">
            Aun no hay recursos cargados.
          </p>
        ) : (
          <div className="space-y-2 text-sm text-zinc-600">
            {course.resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between">
                <span>{resource.title}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {resource.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
