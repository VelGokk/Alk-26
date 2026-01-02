"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { slugify } from "@/lib/utils";

export async function createCourse(formData: FormData) {
  const session = await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const price = Number(formData.get("price") ?? 0);
  if (!title || !description) return;

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  await prisma.course.create({
    data: {
      title,
      description,
      price,
      slug,
      instructorId: session.user.id,
    },
  });

  revalidatePath("/instructor/courses");
}

export async function updateCourse(formData: FormData) {
  await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "");
  if (!courseId || !title) return;

  await prisma.course.update({
    where: { id: courseId },
    data: { title, description, price, thumbnailUrl },
  });

  revalidatePath(`/instructor/courses/${courseId}/edit`);
}

export async function submitForReview(formData: FormData) {
  const session = await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const courseId = String(formData.get("courseId") ?? "");
  if (!courseId) return;

  const reviewer = await prisma.user.findFirst({
    where: { role: Role.REVIEWER, isActive: true },
  });

  await prisma.course.update({
    where: { id: courseId },
    data: { status: "IN_REVIEW" },
  });

  await prisma.courseReview.create({
    data: {
      courseId,
      reviewerId: reviewer?.id ?? session.user.id,
      status: "PENDING",
      comment: "Enviado a revisión",
    },
  });

  revalidatePath("/instructor/courses");
}

export async function createModule(formData: FormData) {
  await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "");
  if (!courseId || !title) return;

  await prisma.courseModule.create({
    data: { courseId, title },
  });

  revalidatePath(`/instructor/courses/${courseId}/modules`);
}

export async function createLesson(formData: FormData) {
  await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const moduleId = String(formData.get("moduleId") ?? "");
  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");
  const contentType = String(formData.get("contentType") ?? "TEXT");
  if (!moduleId || !title) return;

  await prisma.lesson.create({
    data: {
      moduleId,
      title,
      content,
      contentType: contentType as "TEXT" | "VIDEO" | "QUIZ" | "LIVE",
    },
  });

  const module = await prisma.courseModule.findUnique({ where: { id: moduleId } });
  if (module) {
    revalidatePath(`/instructor/courses/${module.courseId}/modules`);
  }
}

export async function addResource(formData: FormData) {
  const session = await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "");
  const url = String(formData.get("url") ?? "");
  const type = String(formData.get("type") ?? "OTHER");
  if (!courseId || !title || !url) return;

  await prisma.courseResource.create({
    data: {
      courseId,
      title,
      url,
      type: type as "PDF" | "IMAGE" | "VIDEO" | "OTHER",
      uploadedById: session.user.id,
    },
  });

  revalidatePath(`/instructor/courses/${courseId}/modules`);
}
