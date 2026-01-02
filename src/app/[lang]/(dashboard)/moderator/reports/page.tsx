import { prisma } from "@/lib/prisma";
import { resolveReport } from "@/lib/actions/moderator";

export default async function ModeratorReportsPage() {
  const reports = await prisma.moderationReport.findMany({
    where: { status: { in: ["OPEN", "IN_REVIEW"] } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Reportes
        </p>
        <h1 className="font-heading text-3xl">Acciones rápidas</h1>
      </div>
      {reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
          No hay reportes abiertos.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="glass-panel rounded-2xl p-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {report.targetType} · {report.status}
                </p>
                <p className="text-sm text-zinc-600">{report.reason}</p>
              </div>
              <form action={resolveReport} className="grid gap-3 md:grid-cols-3">
                <input type="hidden" name="reportId" value={report.id} />
                <select
                  name="actionType"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                >
                  <option value="HIDE">Ocultar</option>
                  <option value="WARN">Advertir</option>
                  <option value="RESOLVE">Resolver</option>
                </select>
                <input
                  name="note"
                  placeholder="Nota interna"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-full bg-ink px-3 py-2 text-xs uppercase tracking-[0.2em] text-white"
                >
                  Confirmar
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
