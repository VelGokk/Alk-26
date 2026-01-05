import type { AppLocale } from "./i18n";

const withLang = (lang: AppLocale, path = "") => `/${lang}${path}`;

const dashboardSectionRoutes = {
  "super-admin": "/super-admin",
  admin: "/admin",
  instructor: "/instructor",
  reviewer: "/reviewer",
  moderator: "/moderator",
  app: "/app",
} as const;

export type DashboardSection = keyof typeof dashboardSectionRoutes;

export const paths = {
  public: {
    home: (lang: AppLocale) => withLang(lang),
    consultoria: (lang: AppLocale) => withLang(lang, "/consultoria"),
    formacion: (lang: AppLocale) => withLang(lang, "/formacion"),
    recursos: (lang: AppLocale) => withLang(lang, "/recursos"),
    nosotros: (lang: AppLocale) => withLang(lang, "/nosotros"),
    contacto: (lang: AppLocale) => withLang(lang, "/contacto"),
    auth: (lang: AppLocale) => withLang(lang, "/auth"),
    courses: (lang: AppLocale) => withLang(lang, "/courses"),
    profile: (lang: AppLocale) => withLang(lang, "/profile"),
    privacidad: (lang: AppLocale) => withLang(lang, "/privacidad"),
    terminos: (lang: AppLocale) => withLang(lang, "/terminos"),
    programs: (lang: AppLocale) => withLang(lang, "/programas"),
    program: (lang: AppLocale, slug: string) =>
      withLang(lang, `/programas/${slug}`),
    programLesson: (lang: AppLocale, slug: string, lessonId: string) =>
      withLang(lang, `/programas/${slug}/lessons/${lessonId}`),
  },
  auth: {
    signIn: (lang: AppLocale) => withLang(lang, "/auth"),
  },
  dashboard: {
    root: (lang: AppLocale) => withLang(lang, dashboardSectionRoutes.app),
    section: (lang: AppLocale, section: DashboardSection) =>
      withLang(lang, dashboardSectionRoutes[section]),
  },
} as const;
export type Paths = typeof paths;
