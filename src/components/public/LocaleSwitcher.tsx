"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n";

export default function LocaleSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(value: string) {
    if (!pathname) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${value}`);
      return;
    }
    segments[0] = value;
    router.push(`/${segments.join("/")}`);
  }

  return (
    <select
      className="rounded-full border border-line bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 font-sans"
      value={current}
      onChange={(event) => handleChange(event.target.value)}
    >
      {SUPPORTED_LOCALES.map((locale) => (
        <option key={locale} value={locale}>
          {LOCALE_LABELS[locale]}
        </option>
      ))}
    </select>
  );
}
