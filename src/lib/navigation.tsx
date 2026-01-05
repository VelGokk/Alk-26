import Link from "next/link";
import { getDictionary, DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import type { Role } from "@prisma/client";
import { getNavigationForRole, ICON_COMPONENTS, type FeatureFlags } from "@/config/navigation";

type NavigationProps = {
  lang: string;
  role: Role;
  flags?: FeatureFlags;
};

export default async function Navigation({
  lang,
  role,
  flags = {},
}: NavigationProps) {
  const resolvedLang = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(resolvedLang);
  const items = getNavigationForRole(role, flags);

  return (
    <>
      {items.map((item) => {
        const Icon = ICON_COMPONENTS[item.icon];
        return (
          <Link
            key={item.id}
            href={item.path(resolvedLang)}
            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-black/5"
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span>{dictionary.dashboard[item.labelKey]}</span>
          </Link>
        );
      })}
    </>
  );
}
