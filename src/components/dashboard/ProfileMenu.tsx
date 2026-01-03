"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Role } from "@prisma/client";
import { useId, useState } from "react";
import { ROLE_HOME, ROLE_LABELS } from "@/lib/constants";

export default function ProfileMenu({
  name,
  email,
  lang,
  role,
}: {
  name?: string | null;
  email?: string | null;
  lang: string;
  role?: Role | null;
}) {
  const roleLabel = role ? ROLE_LABELS[role] : "Usuario";
  const homePath = role ? ROLE_HOME[role] : "/app";
  const menuId = useId();
  const [open, setOpen] = useState(false);

  return (
    <details
      className="relative"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        className="flex list-none items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] cursor-pointer"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Menu de perfil"
      >
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-zinc-500">{roleLabel}</span>
          <span className="text-xs text-ink">{name ?? email ?? "Usuario"}</span>
        </div>
        <span className="rounded-full border border-black/10 px-3 py-1 text-[10px]">
          Menu
        </span>
      </summary>
      <div
        id={menuId}
        className="absolute right-0 mt-3 w-60 rounded-2xl border border-black/10 bg-white/95 p-4 shadow-soft"
        aria-label="Opciones de perfil"
      >
        <div className="space-y-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
          <p>Rol</p>
          <p className="text-xs text-ink">{roleLabel}</p>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-zinc-600">
          <Link
            href={`/${lang}${homePath}`}
            className="rounded-full border border-black/10 px-3 py-2 text-center"
          >
            Ir al panel
          </Link>
          <Link
            href={`/${lang}/profile`}
            className="rounded-full border border-black/10 px-3 py-2 text-center"
          >
            Perfil
          </Link>
          <Link
            href={`/${lang}/profile?tab=settings`}
            className="rounded-full border border-black/10 px-3 py-2 text-center"
          >
            Settings
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: `/${lang}/auth` })}
            className="rounded-full border border-black/10 px-3 py-2 text-center"
          >
            Logout
          </button>
        </div>
      </div>
    </details>
  );
}
