import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { ensurePageDraftRecord } from "@/lib/pageDrafts";

type PageLookup = {
  slug: string;
  lang: string;
  preview?: boolean;
};

type PageSection = {
  id: string;
  type: string;
  order: number;
  enabled: boolean;
  data: Prisma.JsonValue;
};

export type PageContent = {
  id: string;
  slug: string;
  lang: string;
  seoTitle: string | null;
  seoDesc: string | null;
  sections: PageSection[];
  isPublished?: boolean;
  previewToken?: string;
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

export async function getPageContent({
  slug,
  lang,
  preview,
}: PageLookup): Promise<PageContent | null> {
  const resolvedLang = resolveLocale(lang);
  if (preview) {
    const { draft, publishedIsPublished } = await ensurePageDraftRecord(
      slug,
      resolvedLang
    );
    return {
      id: draft.id,
      slug: draft.slug,
      lang: draft.lang,
      seoTitle: draft.seoTitle,
      seoDesc: draft.seoDesc,
      sections: draft.sections,
      isPublished: publishedIsPublished,
      previewToken: draft.previewToken,
    };
  }

  const page = await findPage({ slug, lang: resolvedLang, preview });

  if (!page && resolvedLang !== DEFAULT_LOCALE) {
    const fallback = await findFallbackPage({ slug, preview });
    if (!fallback) return null;
    return {
      id: fallback.id,
      slug: fallback.slug,
      lang: fallback.lang,
      seoTitle: fallback.seoTitle,
      seoDesc: fallback.seoDesc,
      sections: fallback.sections,
      isPublished: fallback.isPublished ?? false,
    };
  }

  if (!page) return null;

  return {
    id: page.id,
    slug: page.slug,
    lang: page.lang,
    seoTitle: page.seoTitle,
    seoDesc: page.seoDesc,
    sections: page.sections,
    isPublished: page.isPublished ?? false,
  };
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
