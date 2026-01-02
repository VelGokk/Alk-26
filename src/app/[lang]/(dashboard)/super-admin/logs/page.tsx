import { prisma } from "@/lib/prisma";
import { LogLevel, Role } from "@prisma/client";
import { requireRole } from "@/lib/auth/guards";

export default async function LogsPage({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  await requireRole([Role.SUPERADMIN]);
  const level = searchParams.level?.toUpperCase();
  const logs = await prisma.systemLog.findMany({
    where: level && Object.values(LogLevel).includes(level as LogLevel) ? { level: level as LogLevel } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Logs</p>
        <h1 className="font-heading text-3xl">Seguridad & auditoría</h1>
      </div>

      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]">
        {["ALL", ...Object.values(LogLevel)].map((item) => (
          <a
            key={item}
            href={`?level=${item === "ALL" ? "" : item}`}
            className="rounded-full border border-black/10 px-3 py-2"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
            No hay logs para este filtro.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="glass-panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                {log.level} · {log.action}
              </p>
              <p className="mt-2 text-sm text-zinc-600">{log.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
