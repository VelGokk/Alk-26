import type dictionary from "./dictionaries/es.json";

export const SUPPORTED_LOCALES = ["es-ar", "es-mx", "en", "pt"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "es-ar";

export const LOCALE_LABELS: Record<AppLocale, string> = {
  "es-ar": "Espanol (AR)",
  "es-mx": "Espanol (MX)",
  en: "English",
  pt: "Portugues",
};

export function isLocale(value?: string | null): value is AppLocale {
  if (!value) return false;
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export type AppDictionary = typeof dictionary;

const dictionaries = {
  "es-ar": () => import("./dictionaries/es.json").then((m) => m.default),
  "es-mx": () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  pt: () => import("./dictionaries/pt.json").then((m) => m.default),
};

export async function getDictionary(locale: AppLocale): Promise<AppDictionary> {
  return dictionaries[locale]();
}

type Primitive = string | number | boolean;

type TranslatorPath<T> = T extends object
  ? {
      [K in keyof T & string]:
        T[K] extends Primitive
          ? `${K}`
          : T[K] extends object
          ? `${K}.${TranslatorPath<T[K]>}`
          : never;
    }[keyof T & string]
  : never;

type TranslatorResult<T, Path extends string> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? TranslatorResult<T[Key], Rest>
    : never
  : Path extends keyof T
  ? T[Path]
  : never;

export type Translator = <P extends TranslatorPath<AppDictionary>>(
  path: P
) => TranslatorResult<AppDictionary, P>;

export function createTranslator(dictionary: AppDictionary): Translator {
  return (path) => t(dictionary, path);
}

export function t<P extends TranslatorPath<AppDictionary>>(
  dictionary: AppDictionary,
  path: P
): TranslatorResult<AppDictionary, P> {
  const segments = path.split(".");
  let current: unknown = dictionary;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null) {
      throw new Error(`Missing translation for key "${path}"`);
    }
    if (!(segment in current as Record<string, unknown>)) {
      throw new Error(`Missing translation for key "${path}"`);
    }
    current = (current as Record<string, unknown>)[segment];
  }

  if (typeof current === "object") {
    throw new Error(`Translation path "${path}" resolved to a non-primitive value`);
  }

  return current as TranslatorResult<AppDictionary, P>;
}
