"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { getPagePath } from "@/lib/pages";
import {
  resolveSectionType,
  sanitizeSectionData,
} from "@/config/sections";
import { resolvePageSlug } from "@/config/pages";

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

  refreshPaths(slug, lang);
}

export async function upsertPageMeta(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  if (!slug || !lang) return;

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const seoDesc = String(formData.get("seoDesc") ?? "").trim();

  await prisma.page.upsert({
    where: { slug_lang: { slug, lang } },
    update: { seoTitle: seoTitle || null, seoDesc: seoDesc || null },
    create: { slug, lang, seoTitle: seoTitle || null, seoDesc: seoDesc || null },
  });

  refreshPaths(slug, lang);
}

export async function updateSection(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const sectionId = String(formData.get("sectionId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  if (!sectionId || !slug || !lang) return;

  const type = resolveSectionType(String(formData.get("type") ?? "").trim() || undefined);
  const order = parseOrder(formData.get("order"));
  const enabled = Boolean(formData.get("enabled"));
  const data = sanitizeSectionData(type, parseJsonPayload(formData.get("data")));

  await prisma.section.update({
    where: { id: sectionId },
    data: { type, order, enabled, data },
  });

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

  await prisma.section.create({
    data: {
      pageId: page.id,
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

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: { id: true, order: true, pageId: true, type: true, enabled: true, data: true },
  });
  if (!section) return;

  const nextOrder = section.order + 1;

  await prisma.$transaction([
    prisma.section.updateMany({
      where: { pageId: section.pageId, order: { gte: nextOrder } },
      data: { order: { increment: 1 } },
    }),
    prisma.section.create({
      data: {
        pageId: section.pageId,
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

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: { id: true, order: true, pageId: true },
  });
  if (!section || (direction !== "up" && direction !== "down")) return;

  const comparator = direction === "up" ? { lt: section.order } : { gt: section.order };
  const orderDirection = direction === "up" ? "desc" : "asc";
  const swap = await prisma.section.findFirst({
    where: { pageId: section.pageId, order: comparator },
    orderBy: { order: orderDirection },
  });
  if (!swap) return;

  await prisma.$transaction([
    prisma.section.update({
      where: { id: section.id },
      data: { order: swap.order },
    }),
    prisma.section.update({
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

  await prisma.page.upsert({
    where: { slug_lang: { slug, lang } },
    update: { isPublished: publish },
    create: { slug, lang, isPublished: publish },
  });

  refreshPaths(slug, lang);
}
