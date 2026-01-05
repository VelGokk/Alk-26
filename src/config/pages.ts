import type { AppLocale } from "./i18n";

export type PageDefinition = {
  slug: string;
  label: string;
  description: string;
};

export const PAGE_CATALOG: PageDefinition[] = [
  { slug: "home", label: "Home", description: "Landing page principal" },
  { slug: "consultoria", label: "Consultoría", description: "Consultoría y servicios" },
  { slug: "formacion", label: "Formación", description: "Programas de formación" },
  { slug: "recursos", label: "Recursos", description: "Recursos y artículos" },
  { slug: "nosotros", label: "Nosotros", description: "Quiénes somos" },
  { slug: "contacto", label: "Contacto", description: "Formulario de contacto" },
];

export const VALID_PAGE_SLUGS = new Set(PAGE_CATALOG.map((entry) => entry.slug));

export function resolvePageSlug(slug?: string) {
  if (!slug) return PAGE_CATALOG[0].slug;
  return VALID_PAGE_SLUGS.has(slug) ? slug : PAGE_CATALOG[0].slug;
}

export function getPageCatalogLabel(slug: string) {
  return PAGE_CATALOG.find((entry) => entry.slug === slug)?.label ?? slug;
}

export function getPagePreviewPath(slug: string, lang: AppLocale) {
  return `/${lang}/preview/${slug}`;
}

export function getPagePath(slug: string, lang: AppLocale) {
  return slug === "home" ? `/${lang}` : `/${lang}/${slug}`;
}
