import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const draftSectionInclude = {
  orderBy: { order: "asc" },
};

export type DraftSectionData = {
  id: string;
  type: string;
  order: number;
  enabled: boolean;
  data: Prisma.JsonValue;
};

export type PageDraftRecord = {
  id: string;
  slug: string;
  lang: string;
  seoTitle: string | null;
  seoDesc: string | null;
  previewToken: string;
  sections: DraftSectionData[];
};

export type EnsureDraftResult = {
  draft: PageDraftRecord;
  publishedIsPublished: boolean;
};

export async function ensurePageDraftRecord(
  slug: string,
  lang: string
): Promise<EnsureDraftResult> {
  const identifier = { slug, lang };
  const existing = await prisma.pageDraft.findUnique({
    where: { slug_lang: identifier },
    include: { sections: draftSectionInclude },
  });

  if (existing) {
    const published = await prisma.page.findFirst({
      where: { slug_lang: identifier },
      select: { isPublished: true },
    });
    return {
      draft: {
        id: existing.id,
        slug: existing.slug,
        lang: existing.lang,
        seoTitle: existing.seoTitle,
        seoDesc: existing.seoDesc,
        previewToken: existing.previewToken,
        sections: existing.sections,
      },
      publishedIsPublished: published?.isPublished ?? false,
    };
  }

  const published = await prisma.page.findUnique({
    where: { slug_lang: identifier },
    include: { sections: draftSectionInclude },
  });

  const created = await prisma.$transaction(async (tx) => {
    const draft = await tx.pageDraft.create({
      data: {
        slug,
        lang,
        seoTitle: published?.seoTitle ?? null,
        seoDesc: published?.seoDesc ?? null,
      },
    });

    if (published?.sections?.length) {
      await Promise.all(
        published.sections.map((section) =>
          tx.draftSection.create({
            data: {
              pageDraftId: draft.id,
              type: section.type,
              order: section.order,
              enabled: section.enabled,
              data: section.data,
            },
          })
        )
      );
    }

    return tx.pageDraft.findUnique({
      where: { id: draft.id },
      include: { sections: draftSectionInclude },
    });
  });

  if (!created) {
    throw new Error("No se pudo crear el borrador de la página.");
  }

  return {
    draft: {
      id: created.id,
      slug: created.slug,
      lang: created.lang,
      seoTitle: created.seoTitle,
      seoDesc: created.seoDesc,
      previewToken: created.previewToken,
      sections: created.sections,
    },
    publishedIsPublished: published?.isPublished ?? false,
  };
}

export async function publishDraftContent(
  slug: string,
  lang: string
): Promise<{ previewToken: string } | null> {
  const identifier = { slug, lang };
  const result = await ensurePageDraftRecord(slug, lang);
  const draft = result.draft;

  const publishResult = await prisma.$transaction(async (tx) => {
    const page = await tx.page.upsert({
      where: { slug_lang: identifier },
      update: {},
      create: { slug, lang },
    });

    await tx.section.deleteMany({ where: { pageId: page.id } });

    if (draft.sections.length > 0) {
      await Promise.all(
        draft.sections.map((section) =>
          tx.section.create({
            data: {
              pageId: page.id,
              type: section.type,
              order: section.order,
              enabled: section.enabled,
              data: section.data,
            },
          })
        )
      );
    }

    await tx.page.update({
      where: { id: page.id },
      data: {
        seoTitle: draft.seoTitle,
        seoDesc: draft.seoDesc,
        isPublished: true,
      },
    });

    const token = randomUUID();
    await tx.pageDraft.update({
      where: { id: draft.id },
      data: { previewToken: token },
    });

    return token;
  });

  return { previewToken: publishResult };
}

export async function getDraftContent(
  slug: string,
  lang: string
): Promise<PageDraftRecord | null> {
  const draft = await prisma.pageDraft.findUnique({
    where: { slug_lang: { slug, lang } },
    include: { sections: draftSectionInclude },
  });
  if (!draft) return null;
  return {
    id: draft.id,
    slug: draft.slug,
    lang: draft.lang,
    seoTitle: draft.seoTitle,
    seoDesc: draft.seoDesc,
    previewToken: draft.previewToken,
    sections: draft.sections,
  };
}
