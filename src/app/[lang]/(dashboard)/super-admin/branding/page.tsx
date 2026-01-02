import { getBranding } from "@/lib/settings";
import { updateBranding } from "@/lib/actions/admin";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function BrandingPage() {
  await requireRole([Role.SUPERADMIN]);
  const branding = await getBranding();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Branding
        </p>
        <h1 className="font-heading text-3xl">Identidad visual</h1>
      </div>

      <form action={updateBranding} className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Logo URL
            </label>
            <input
              name="logoUrl"
              defaultValue={branding.logoUrl ?? ""}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Color primario
            </label>
            <input
              name="primaryColor"
              defaultValue={branding.primaryColor}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Color secundario
            </label>
            <input
              name="secondaryColor"
              defaultValue={branding.secondaryColor}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Color acento
            </label>
            <input
              name="accentColor"
              defaultValue={branding.accentColor}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
        >
          Guardar cambios
        </button>
      </form>

      <div className="glass-panel rounded-2xl p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Preview rápido
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-xl"
            style={{ backgroundColor: branding.primaryColor }}
          />
          <div
            className="h-12 w-12 rounded-xl"
            style={{ backgroundColor: branding.secondaryColor }}
          />
          <div
            className="h-12 w-12 rounded-xl"
            style={{ backgroundColor: branding.accentColor }}
          />
        </div>
      </div>
    </div>
  );
}
