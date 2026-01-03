import type { AppLocale } from "@/lib/i18n";

const withLang = (lang: AppLocale, path = "") => `/${lang}${path}`;

export const paths = {
  public: {
    home: (lang: AppLocale) => withLang(lang),
    consultoria: (lang: AppLocale) => withLang(lang, "/consultoria"),
    formacion: (lang: AppLocale) => withLang(lang, "/formacion"),
    recursos: (lang: AppLocale) => withLang(lang, "/recursos"),
    nosotros: (lang: AppLocale) => withLang(lang, "/nosotros"),
    contacto: (lang: AppLocale) => withLang(lang, "/contacto"),
    auth: (lang: AppLocale) => withLang(lang, "/auth"),
  },
  dashboard: {
    app: (lang: AppLocale) => withLang(lang, "/app"),
  },
} as const;
