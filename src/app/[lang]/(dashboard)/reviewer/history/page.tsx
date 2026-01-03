import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function ReviewerHistoryPage() {
  await requireRole([Role.REVIEWER, Role.SUPERADMIN]);
  const reviews = await prisma.courseReview.findMany({
    where: { status: { in: ["APPROVED", "REJECTED"] } },
    include: { course: true, reviewer: true },
    orderBy: { updatedAt: "desc" },
    take: 30,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Historial
        </p>
        <h1 className="font-heading text-3xl">Revisiones previas</h1>
      </div>
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
          Todavia no hay revisiones cerradas.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="glass-panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                {review.status}
              </p>
              <p className="font-heading text-lg">{review.course.title}</p>
              <p className="text-sm text-zinc-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
