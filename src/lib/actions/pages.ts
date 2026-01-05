"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { getPagePath, getPagePreviewPath } from "@/config/pages";
import {
  resolveSectionType,
  sanitizeSectionData,
} from "@/config/sections";
import { resolvePageSlug } from "@/config/pages";
import {
  ensurePageDraftRecord,
  publishDraftContent,
} from "@/lib/pageDrafts";

function parseJsonPayload(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function parseOrder(value: FormDataEntryValue | null) {
  const parsed = Number.parseInt(String(value ?? "0"), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function refreshPaths(slug: string, lang: string) {
  revalidatePath(getPagePath(slug, lang));
  revalidatePath(getPagePreviewPath(slug, lang));
  revalidatePath(`/${lang}/super-admin/pages/${slug}`);
}

function resolveSlug(value: FormDataEntryValue | null) {
  return resolvePageSlug(String(value ?? ""));
}

export async function createPage(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const slug = resolveSlug(formData.get("slug"));
  const lang = String(formData.get("lang") ?? "");
  if (!slug || !lang) return;

  await prisma.page.upsert({
    where: { slug_lang: { slug, lang } },
    update: {},
    create: { slug, lang },
  });

  await ensurePageDraftRecord(slug, lang);

  refreshPaths(slug, lang);
}

export async function upsertPageMeta(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  if (!slug || !lang) return;

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const seoDesc = String(formData.get("seoDesc") ?? "").trim();
  const action = String(formData.get("action") ?? "save").toLowerCase();
  const { draft } = await ensurePageDraftRecord(slug, lang);

  await prisma.pageDraft.update({
    where: { id: draft.id },
    data: { seoTitle: seoTitle || null, seoDesc: seoDesc || null },
  });

  if (action === "publish") {
    await publishDraftContent(slug, lang);
  }

  refreshPaths(slug, lang);
}

export async function updateSection(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const sectionId = String(formData.get("sectionId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  if (!sectionId || !slug || !lang) return;

  await ensurePageDraftRecord(slug, lang);
  const type = resolveSectionType(String(formData.get("type") ?? "").trim() || undefined);
  const order = parseOrder(formData.get("order"));
  const enabled = Boolean(formData.get("enabled"));
  const data = sanitizeSectionData(type, parseJsonPayload(formData.get("data")));
  const action = String(formData.get("action") ?? "save").toLowerCase();

  await prisma.draftSection.update({
    where: { id: sectionId },
    data: { type, order, enabled, data },
  });

  if (action === "publish") {
    await publishDraftContent(slug, lang);
  }

  refreshPaths(slug, lang);
}

export async function addSection(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  if (!slug || !lang) return;

  const type = resolveSectionType(String(formData.get("type") ?? "").trim() || undefined);
  const order = parseOrder(formData.get("order"));
  const enabled = Boolean(formData.get("enabled"));
  const data = sanitizeSectionData(type, parseJsonPayload(formData.get("data")));

  const page = await prisma.page.upsert({
    where: { slug_lang: { slug, lang } },
    update: {},
    create: { slug, lang },
  });
  const { draft } = await ensurePageDraftRecord(slug, lang);

  await prisma.draftSection.create({
    data: {
      pageDraftId: draft.id,
      type,
      order,
      enabled,
      data,
    },
  });

  refreshPaths(slug, lang);
}

export async function duplicateSection(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const sectionId = String(formData.get("sectionId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  if (!sectionId || !slug || !lang) return;

  const section = await prisma.draftSection.findUnique({
    where: { id: sectionId },
    select: { id: true, order: true, pageDraftId: true, type: true, enabled: true, data: true },
  });
  if (!section) return;

  const nextOrder = section.order + 1;

  await prisma.$transaction([
    prisma.draftSection.updateMany({
      where: { pageDraftId: section.pageDraftId, order: { gte: nextOrder } },
      data: { order: { increment: 1 } },
    }),
    prisma.draftSection.create({
      data: {
        pageDraftId: section.pageDraftId,
        type: section.type,
        enabled: section.enabled,
        order: nextOrder,
        data: section.data,
      },
    }),
  ]);

  refreshPaths(slug, lang);
}

export async function reorderSection(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const sectionId = String(formData.get("sectionId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  const direction = String(formData.get("direction") ?? "").toLowerCase();
  if (!sectionId || !slug || !lang) return;

  const section = await prisma.draftSection.findUnique({
    where: { id: sectionId },
    select: { id: true, order: true, pageDraftId: true },
  });
  if (!section || (direction !== "up" && direction !== "down")) return;

  const comparator = direction === "up" ? { lt: section.order } : { gt: section.order };
  const orderDirection = direction === "up" ? "desc" : "asc";
  const swap = await prisma.draftSection.findFirst({
    where: { pageDraftId: section.pageDraftId, order: comparator },
    orderBy: { order: orderDirection },
  });
  if (!swap) return;

  await prisma.$transaction([
    prisma.draftSection.update({
      where: { id: section.id },
      data: { order: swap.order },
    }),
    prisma.draftSection.update({
      where: { id: swap.id },
      data: { order: section.order },
    }),
  ]);

  refreshPaths(slug, lang);
}

export async function setPagePublication(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  if (!slug || !lang) return;
  const action = String(formData.get("action") ?? "").toLowerCase();
  const publish = action === "publish";

  if (publish) {
    await publishDraftContent(slug, lang);
  } else {
    await prisma.page.upsert({
      where: { slug_lang: { slug, lang } },
      update: { isPublished: false },
      create: { slug, lang, isPublished: false },
    });
  }

  refreshPaths(slug, lang);
}
