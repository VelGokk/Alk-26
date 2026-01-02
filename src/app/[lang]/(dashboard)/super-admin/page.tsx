import { prisma } from "@/lib/prisma";
import { OPTIONAL_ENV } from "@/lib/env";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function SuperAdminDashboard() {
  await requireRole([Role.SUPERADMIN]);
  const [users, courses, payments, logs] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.payment.count(),
    prisma.systemLog.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const integrations = OPTIONAL_ENV.map((key) => ({
    key,
    enabled: Boolean(process.env[key]),
  }));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Superadmin
        </p>
        <h1 className="font-heading text-3xl">Gobierno del sistema</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Usuarios
          </p>
          <p className="mt-2 text-2xl font-heading">{users}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Cursos
          </p>
          <p className="mt-2 text-2xl font-heading">{courses}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Pagos
          </p>
          <p className="mt-2 text-2xl font-heading">{payments}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="font-heading text-xl">Integraciones</h2>
          <div className="mt-4 space-y-2 text-sm">
            {integrations.map((integration) => (
              <div
                key={integration.key}
                className="flex items-center justify-between rounded-xl border border-black/5 px-3 py-2"
              >
                <span>{integration.key}</span>
                <span
                  className={`text-xs uppercase tracking-[0.2em] ${
                    integration.enabled ? "text-emerald-600" : "text-zinc-500"
                  }`}
                >
                  {integration.enabled ? "ON" : "OFF"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="font-heading text-xl">Últimos logs</h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-600">
            {logs.length === 0 ? (
              <p>No hay registros recientes.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="border-b border-black/5 pb-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {log.level} · {log.action}
                  </p>
                  <p>{log.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
