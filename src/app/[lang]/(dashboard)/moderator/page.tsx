import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function ModeratorDashboard() {
  await requireRole([Role.MODERATOR, Role.SUPERADMIN]);
  const openReports = await prisma.moderationReport.count({
    where: { status: "OPEN" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Moderacion
        </p>
        <h1 className="font-heading text-3xl">Panel de reportes</h1>
      </div>
      <div className="glass-panel rounded-2xl p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Reportes abiertos
        </p>
        <p className="mt-2 text-2xl font-heading">{openReports}</p>
      </div>
    </div>
  );
}
