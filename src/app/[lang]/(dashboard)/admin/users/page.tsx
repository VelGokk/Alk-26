import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/constants";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function AdminUsersPage() {
  await requireRole([Role.ADMIN, Role.SUPERADMIN]);
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Usuarios
        </p>
        <h1 className="font-heading text-3xl">Listado general</h1>
      </div>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="glass-panel rounded-2xl p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-heading text-lg">{user.name ?? "Sin nombre"}</p>
                <p className="text-sm text-zinc-600">{user.email}</p>
              </div>
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
