import { prisma } from "@/lib/prisma";

export default async function ReviewerDashboard() {
  const pending = await prisma.courseReview.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Reviewer
        </p>
        <h1 className="font-heading text-3xl">Revisiones</h1>
      </div>
      <div className="glass-panel rounded-2xl p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Pendientes
        </p>
        <p className="mt-2 text-2xl font-heading">{pending}</p>
      </div>
    </div>
  );
}
