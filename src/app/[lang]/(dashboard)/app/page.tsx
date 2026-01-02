import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  const [enrollments, payments] = await Promise.all([
    prisma.enrollment.count({ where: { userId: session?.user.id } }),
    prisma.payment.count({ where: { userId: session?.user.id } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Alumno
        </p>
        <h1 className="font-heading text-3xl">Mi progreso</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Cursos activos
          </p>
          <p className="mt-2 text-2xl font-heading">{enrollments}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Pagos registrados
          </p>
          <p className="mt-2 text-2xl font-heading">{payments}</p>
        </div>
      </div>
    </div>
  );
}
