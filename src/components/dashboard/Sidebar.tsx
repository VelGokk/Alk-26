import type { Role } from "@prisma/client";
import BrandMark from "@/components/public/BrandMark";
import Navigation from "@/lib/navigation";
import { ROLE_LABELS } from "@/lib/constants";
import type { FeatureFlags } from "@/config/navigation";

export default function Sidebar({
  lang,
  flags,
  activeRole,
}: {
  lang: string;
  flags: FeatureFlags;
  activeRole: Role;
}) {
  const roleLabel = ROLE_LABELS[activeRole] ?? "Dashboard";

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-black/10 bg-white/70 px-4 py-6 backdrop-blur lg:flex">
      <div className="mb-8 space-y-2">
        <BrandMark href={`/${lang}`} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          {roleLabel}
        </p>
      </div>
      <nav className="flex flex-col gap-2 text-sm text-zinc-600" aria-label={roleLabel}>
        <Navigation lang={lang} role={activeRole} flags={flags} />
      </nav>
    </aside>
  );
}
