"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AppLocale } from "@/lib/i18n";
import type { Role } from "@prisma/client";
import { ROLE_LABELS } from "@/lib/constants";
import { paths } from "@/lib/paths";
import { ROLE_DASHBOARD_SECTION } from "@/config/roles";

type RoleSwitcherProps = {
  roles: Role[];
  activeRole: Role;
  lang: AppLocale;
  title?: string;
};

export default function RoleSwitcher({
  roles,
  activeRole,
  lang,
}: RoleSwitcherProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(activeRole);

  useEffect(() => {
    setSelectedRole(activeRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeRole", activeRole);
    }
  }, [activeRole]);

  const handleSwitch = async (nextRole: Role) => {
    if (nextRole === activeRole) return;
    setSelectedRole(nextRole);
    const payload = { role: nextRole };
    const response = await fetch("/api/roles", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("No se pudo cambiar el rol", await response.text());
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("activeRole", nextRole);
    }
    router.refresh();
    const section = ROLE_DASHBOARD_SECTION[nextRole] ?? "app";
    const target = paths.dashboard.section(lang, section);
    router.push(target);
  };

  const availableRoles = Array.from(new Set([...roles, activeRole]));

  return (
    <div className="mt-4 space-y-2">
      <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
        {title ?? "Cambiar rol"}
      </p>
      <div className="flex flex-wrap gap-2">
        {availableRoles.map((role) => {
          const isActive = role === selectedRole;
          return (
            <button
              type="button"
              key={role}
              disabled={isActive}
              onClick={() => handleSwitch(role)}
              className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.3em] transition ${
                isActive
                  ? "border-ink bg-ink text-white"
                  : "border-black/10 bg-white text-slate-600"
              }`}
            >
              {ROLE_LABELS[role]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
