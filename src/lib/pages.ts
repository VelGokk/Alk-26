import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

type PageLookup = {
  slug: string;
  lang: string;
};

function resolveLocale(lang: string) {
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

export function getPagePath(slug: string, lang: string) {
  return slug === "home" ? `/${lang}` : `/${lang}/${slug}`;
}

export async function getPageContent({ slug, lang }: PageLookup) {
  const resolvedLang = resolveLocale(lang);
  const page = await prisma.page.findUnique({
    where: { slug_lang: { slug, lang: resolvedLang } },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  if (!page && resolvedLang !== DEFAULT_LOCALE) {
    return prisma.page.findUnique({
      where: { slug_lang: { slug, lang: DEFAULT_LOCALE } },
      include: { sections: { orderBy: { order: "asc" } } },
    });
  }

  return page;
}

export async function getPageMetadata({ slug, lang }: PageLookup): Promise<Metadata> {
  const resolvedLang = resolveLocale(lang);
  const page = await prisma.page.findUnique({
    where: { slug_lang: { slug, lang: resolvedLang } },
    select: { seoTitle: true, seoDesc: true },
  });

  const resolvedPage =
    page ??
    (resolvedLang !== DEFAULT_LOCALE
      ? await prisma.page.findUnique({
          where: { slug_lang: { slug, lang: DEFAULT_LOCALE } },
          select: { seoTitle: true, seoDesc: true },
        })
      : null);

  if (!resolvedPage) return {};

  return {
    title: resolvedPage.seoTitle ?? undefined,
    description: resolvedPage.seoDesc ?? undefined,
  };
}
