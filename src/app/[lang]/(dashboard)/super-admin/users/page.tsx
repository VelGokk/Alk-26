import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/constants";
import { updateUserRole, toggleUserActive } from "@/lib/actions/admin";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth/guards";

export default async function SuperAdminUsersPage() {
  await requireRole([Role.SUPERADMIN]);
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Usuarios & roles
        </p>
        <h1 className="font-heading text-3xl">Gestion de accesos</h1>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="glass-panel flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-heading text-lg">{user.name ?? "Sin nombre"}</p>
              <p className="text-sm text-zinc-600">{user.email}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                {ROLE_LABELS[user.role]}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <form action={updateUserRole} className="flex items-center gap-2">
                <input type="hidden" name="userId" value={user.id} />
                <select
                  name="role"
                  defaultValue={user.role}
                  className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.2em]"
                >
                  {Object.values(Role).map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-full border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.2em]"
                >
                  Guardar
                </button>
              </form>
              <form action={toggleUserActive}>
                <input type="hidden" name="userId" value={user.id} />
                <button
                  type="submit"
                  className="rounded-full bg-ink px-3 py-2 text-xs uppercase tracking-[0.2em] text-white"
                >
                  {user.isActive ? "Desactivar" : "Activar"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
