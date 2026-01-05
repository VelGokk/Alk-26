import { paths } from "./paths";
import type { AppLocale } from "./i18n";
import { SUPPORTED_LOCALES } from "./i18n";

export type SeoDefaults = {
  title: string;
  description: string;
  metadataBase: string;
  applicationName: string;
  contactEmail: string;
  twitterHandle: string;
  openGraphImage: string;
  logoPath: string;
};

export const SEO_DEFAULTS: SeoDefaults = {
  title: "ALKAYA | Consultoria Ontologica",
  description:
    "Consultora de coaching ontologico para lideres y organizaciones. Procesos de transformacion sostenidos.",
  metadataBase: "https://alkaya.com",
  applicationName: "ALKAYA",
  contactEmail: "hola@alkaya.com",
  twitterHandle: "@alkaya",
  openGraphImage: "/og-banner.svg",
  logoPath: "/alkaya-logo.svg",
};

export type SitemapRoute = {
  path: (lang: AppLocale) => string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
};

export const SITEMAP_ROUTES: SitemapRoute[] = [
  {
    path: (lang) => paths.public.home(lang),
    changefreq: "daily",
    priority: 1.0,
  },
  {
    path: (lang) => paths.public.consultoria(lang),
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    path: (lang) => paths.public.formacion(lang),
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    path: (lang) => paths.public.recursos(lang),
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: (lang) => paths.public.nosotros(lang),
    changefreq: "weekly",
    priority: 0.6,
  },
  {
    path: (lang) => paths.public.contacto(lang),
    changefreq: "monthly",
    priority: 0.5,
  },
  {
    path: (lang) => paths.public.programs(lang),
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: (lang) => paths.public.courses(lang),
    changefreq: "weekly",
    priority: 0.6,
  },
  {
    path: (lang) => paths.public.profile(lang),
    changefreq: "monthly",
    priority: 0.4,
  },
];

export const SITE_LOCALES = SUPPORTED_LOCALES;
