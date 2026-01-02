import { getSystemSettings } from "@/lib/settings";
import { toggleMaintenance } from "@/lib/actions/admin";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function MaintenancePage() {
  await requireRole([Role.SUPERADMIN]);
  const settings = await getSystemSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Mantenimiento
        </p>
        <h1 className="font-heading text-3xl">Modo mantenimiento</h1>
      </div>

      <form action={toggleMaintenance} className="glass-panel rounded-2xl p-6 space-y-4">
        <p className="text-sm text-zinc-600">
          Estado actual:{" "}
          <strong>{settings.maintenanceMode ? "ACTIVO" : "INACTIVO"}</strong>
        </p>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Mensaje
          </label>
          <textarea
            name="message"
            defaultValue={settings.maintenanceMessage}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
        >
          {settings.maintenanceMode ? "Desactivar" : "Activar"}
        </button>
      </form>
    </div>
  );
}
