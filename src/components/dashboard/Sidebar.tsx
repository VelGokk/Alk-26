import Link from "next/link";
import { NAV_ITEMS } from "@/lib/navigation";
import type { Role } from "@prisma/client";
import BrandMark from "@/components/public/BrandMark";
import { ROLE_LABELS } from "@/lib/constants";

export default function Sidebar({
  lang,
  role,
}: {
  lang: string;
  role: Role;
}) {
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const roleLabel = ROLE_LABELS[role] ?? "Dashboard";

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-black/10 bg-white/70 px-4 py-6 backdrop-blur lg:flex">
      <div className="mb-8 space-y-2">
        <BrandMark href={`/${lang}`} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          {roleLabel}
        </p>
      </div>
      <nav className="flex flex-col gap-2 text-sm text-zinc-600" aria-label={roleLabel}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={`/${lang}${item.href}`}
            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-black/5"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
