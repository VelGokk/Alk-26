import BrandingControls from "@/components/super-admin/BrandingControls";
import { getBranding } from "@/lib/settings";
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
        <p className="mt-1 text-sm text-zinc-600">
          Actualiza colores, radios y desenfoques que se aplican a todo el
          tablero.
        </p>
      </div>

      <BrandingControls branding={branding} />
    </div>
  );
}
