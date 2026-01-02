import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function InstructorDashboard() {
  await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const session = await getServerSession(authOptions);
  const courses = await prisma.course.count({
    where: { instructorId: session?.user.id },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Instructor
        </p>
        <h1 className="font-heading text-3xl">Tus métricas</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Cursos creados
          </p>
          <p className="mt-2 text-2xl font-heading">{courses}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Estado principal
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Seguí creando contenido y enviá cursos a revisión.
          </p>
        </div>
      </div>
    </div>
  );
}
