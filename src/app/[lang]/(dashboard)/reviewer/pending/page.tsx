import { prisma } from "@/lib/prisma";
import { approveCourse, rejectCourse } from "@/lib/actions/reviewer";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function ReviewerPendingPage() {
  await requireRole([Role.REVIEWER, Role.SUPERADMIN]);
  const pending = await prisma.courseReview.findMany({
    where: { status: "PENDING" },
    include: { course: true, reviewer: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Pendientes
        </p>
        <h1 className="font-heading text-3xl">Cursos para revisar</h1>
      </div>
      {pending.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
          No hay cursos pendientes.
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((review) => (
            <div key={review.id} className="glass-panel rounded-2xl p-4 space-y-3">
              <div>
                <p className="font-heading text-xl">{review.course.title}</p>
                <p className="text-sm text-zinc-600">
                  {review.course.description}
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <form action={approveCourse} className="space-y-2">
                  <input type="hidden" name="reviewId" value={review.id} />
                  <textarea
                    name="comment"
                    placeholder="Comentarios de aprobación"
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-ink px-3 py-2 text-xs uppercase tracking-[0.2em] text-white"
                  >
                    Aprobar
                  </button>
                </form>
                <form action={rejectCourse} className="space-y-2">
                  <input type="hidden" name="reviewId" value={review.id} />
                  <textarea
                    name="comment"
                    placeholder="Motivo de rechazo"
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.2em]"
                  >
                    Rechazar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
