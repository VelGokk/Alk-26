export const SUPPORTED_LOCALES = ["es-ar", "es-mx", "en"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "es-ar";

export const LOCALE_LABELS: Record<AppLocale, string> = {
  "es-ar": "Español (AR)",
  "es-mx": "Español (MX)",
  en: "English",
};

export function isLocale(value?: string | null): value is AppLocale {
  if (!value) return false;
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

const dictionaries = {
  "es-ar": () => import("./dictionaries/es-ar.json").then((m) => m.default),
  "es-mx": () => import("./dictionaries/es-mx.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export async function getDictionary(locale: AppLocale) {
  return dictionaries[locale]();
}
