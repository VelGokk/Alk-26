import { prisma } from "@/lib/prisma";
import { PaymentStatus, Role } from "@prisma/client";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminReportsPage() {
  await requireRole([Role.ADMIN, Role.SUPERADMIN]);
  const [enrollments, payments] = await Promise.all([
    prisma.enrollment.count(),
    prisma.payment.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Reportes
        </p>
        <h1 className="font-heading text-3xl">Indicadores basicos</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Enrolments
          </p>
          <p className="mt-2 text-2xl font-heading">{enrollments}</p>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Pagos por estado
          </p>
          <div className="mt-4 space-y-2 text-sm text-zinc-600">
            {Object.values(PaymentStatus).map((status) => {
              const row = payments.find((item) => item.status === status);
              return (
                <div key={status} className="flex items-center justify-between">
                  <span>{status}</span>
                  <span>{row?._count ?? 0}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

