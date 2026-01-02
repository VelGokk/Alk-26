import Link from "next/link";
import { NAV_ITEMS } from "@/lib/navigation";
import type { Role } from "@prisma/client";
import BrandMark from "@/components/public/BrandMark";

export default function Sidebar({
  lang,
  role,
}: {
  lang: string;
  role: Role;
}) {
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-black/10 bg-white/70 px-4 py-6 backdrop-blur lg:flex">
      <div className="mb-8">
        <BrandMark href={`/${lang}`} />
      </div>
      <nav className="flex flex-col gap-2 text-sm text-zinc-600">
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
