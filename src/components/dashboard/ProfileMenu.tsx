"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function ProfileMenu({
  name,
  email,
  lang,
}: {
  name?: string | null;
  email?: string | null;
  lang: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em]">
      <div className="flex flex-col text-right">
        <span className="text-[10px] text-zinc-500">Perfil</span>
        <span className="text-xs text-ink">
          {name ?? email ?? "Usuario"}
        </span>
      </div>
      <Link
        href={`/${lang}/profile`}
        className="rounded-full border border-black/10 px-3 py-1 text-[10px]"
      >
        Perfil
      </Link>
      <Link
        href={`/${lang}/profile?tab=settings`}
        className="rounded-full border border-black/10 px-3 py-1 text-[10px]"
      >
        Settings
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: `/${lang}/auth` })}
        className="rounded-full border border-black/10 px-3 py-1 text-[10px]"
      >
        Logout
      </button>
    </div>
  );
}
