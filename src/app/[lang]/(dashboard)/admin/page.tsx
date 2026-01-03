import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function AdminDashboard() {
  await requireRole([Role.ADMIN, Role.SUPERADMIN]);
  const [courses, users, enrollments, payments] = await Promise.all([
    prisma.course.count(),
    prisma.user.count(),
    prisma.enrollment.count(),
    prisma.payment.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Admin</p>
        <h1 className="font-heading text-3xl">Operacion</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Cursos", value: courses },
          { label: "Usuarios", value: users },
          { label: "Enrolments", value: enrollments },
          { label: "Pagos", value: payments },
        ].map((card) => (
          <div key={card.label} className="glass-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-heading">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
