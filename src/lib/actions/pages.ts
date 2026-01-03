"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { getPagePath } from "@/lib/pages";

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

function shouldPublish(formData: FormData) {
  return String(formData.get("action") ?? "").toLowerCase() === "publish";
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

  if (shouldPublish(formData)) {
    revalidatePath(getPagePath(slug, lang));
  }

  revalidatePath(`/${lang}/super-admin/pages/${slug}`);
}

export async function updateSection(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const sectionId = String(formData.get("sectionId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  if (!sectionId || !slug || !lang) return;

  const type = String(formData.get("type") ?? "").trim();
  const order = parseOrder(formData.get("order"));
  const enabled = Boolean(formData.get("enabled"));
  const data = parseJsonPayload(formData.get("data"));

  await prisma.section.update({
    where: { id: sectionId },
    data: { type, order, enabled, data },
  });

  if (shouldPublish(formData)) {
    revalidatePath(getPagePath(slug, lang));
  }

  revalidatePath(`/${lang}/super-admin/pages/${slug}`);
}

export async function addSection(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  if (!slug || !lang) return;

  const type = String(formData.get("type") ?? "").trim() || "cards";
  const order = parseOrder(formData.get("order"));
  const enabled = Boolean(formData.get("enabled"));
  const data = parseJsonPayload(formData.get("data"));

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

  revalidatePath(`/${lang}/super-admin/pages/${slug}`);
}

export async function publishPage(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "");
  if (!slug || !lang) return;

  revalidatePath(getPagePath(slug, lang));
  revalidatePath(`/${lang}/super-admin/pages/${slug}`);
}
