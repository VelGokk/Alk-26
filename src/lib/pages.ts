import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

type PageLookup = {
  slug: string;
  lang: string;
  preview?: boolean;
};

function resolveLocale(lang: string) {
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

export function getPagePath(slug: string, lang: string) {
  return slug === "home" ? `/${lang}` : `/${lang}/${slug}`;
}

function buildPageQuery(slug: string, lang: string, preview?: boolean) {
  const base: Record<string, unknown> = { slug, lang };
  if (!preview) {
    base.isPublished = true;
  }
  return base;
}

async function findPage({
  slug,
  lang,
  preview,
}: PageLookup) {
  return prisma.page.findFirst({
    where: buildPageQuery(slug, lang, preview),
    include: { sections: { orderBy: { order: "asc" } } },
  });
}

async function findFallbackPage({
  slug,
  preview,
}: {
  slug: string;
  preview?: boolean;
}) {
  return prisma.page.findFirst({
    where: buildPageQuery(slug, DEFAULT_LOCALE, preview),
    include: { sections: { orderBy: { order: "asc" } } },
  });
}

export async function getPageContent({ slug, lang, preview }: PageLookup) {
  const resolvedLang = resolveLocale(lang);
  const page = await findPage({ slug, lang: resolvedLang, preview });

  if (!page && resolvedLang !== DEFAULT_LOCALE) {
    return findFallbackPage({ slug, preview });
  }

  return page;
}

export async function getPageMetadata({
  slug,
  lang,
}: PageLookup): Promise<Metadata> {
  const resolvedLang = resolveLocale(lang);
  const page = await prisma.page.findFirst({
    where: buildPageQuery(slug, resolvedLang),
    select: { seoTitle: true, seoDesc: true },
  });

  const resolvedPage =
    page ??
    (resolvedLang !== DEFAULT_LOCALE
      ? await prisma.page.findFirst({
          where: buildPageQuery(slug, DEFAULT_LOCALE),
          select: { seoTitle: true, seoDesc: true },
        })
      : null);

  if (!resolvedPage) return {};

  return {
    title: resolvedPage.seoTitle ?? undefined,
    description: resolvedPage.seoDesc ?? undefined,
  };
}
