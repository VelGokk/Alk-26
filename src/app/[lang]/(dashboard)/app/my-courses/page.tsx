import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toggleLessonComplete } from "@/lib/actions/student";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function MyCoursesPage() {
  await requireRole([Role.USER, Role.SUBSCRIBER, Role.SUPERADMIN]);
  const session = await getServerSession(authOptions);
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session?.user.id },
    include: {
      course: { include: { modules: { include: { lessons: true } } } },
      progress: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Mis cursos
        </p>
        <h1 className="font-heading text-3xl">Aprendizaje activo</h1>
      </div>

      {enrollments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
          Todavía no compraste cursos.
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading text-xl">{enrollment.course.title}</p>
                  <p className="text-sm text-zinc-600">
                    Progreso: {enrollment.progressPercent}%
                  </p>
                </div>
                <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                  {enrollment.status}
                </span>
              </div>

              <div className="space-y-4">
                {enrollment.course.modules.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {module.title}
                    </p>
                    {module.lessons.map((lesson) => {
                      const completed = enrollment.progress.some(
                        (progress) => progress.lessonId === lesson.id && progress.completed
                      );
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between rounded-xl border border-black/5 px-3 py-2 text-sm"
                        >
                          <span>{lesson.title}</span>
                          <form action={toggleLessonComplete}>
                            <input type="hidden" name="enrollmentId" value={enrollment.id} />
                            <input type="hidden" name="lessonId" value={lesson.id} />
                            <button
                              type="submit"
                              className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                                completed ? "bg-emerald-500 text-white" : "border border-black/10"
                              }`}
                            >
                              {completed ? "Completada" : "Marcar"}
                            </button>
                          </form>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
