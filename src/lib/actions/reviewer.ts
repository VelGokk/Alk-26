"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export async function approveCourse(formData: FormData) {
  const session = await requireRole([Role.REVIEWER, Role.SUPERADMIN]);
  const reviewId = String(formData.get("reviewId") ?? "");
  const comment = String(formData.get("comment") ?? "");
  if (!reviewId) return;

  const review = await prisma.courseReview.update({
    where: { id: reviewId },
    data: {
      status: "APPROVED",
      comment,
      reviewerId: session.user.id,
    },
    include: { course: true },
  });

  await prisma.course.update({
    where: { id: review.courseId },
    data: { status: "PUBLISHED" },
  });

  revalidatePath("/reviewer/pending");
  revalidatePath("/reviewer/history");
}

export async function rejectCourse(formData: FormData) {
  const session = await requireRole([Role.REVIEWER, Role.SUPERADMIN]);
  const reviewId = String(formData.get("reviewId") ?? "");
  const comment = String(formData.get("comment") ?? "");
  if (!reviewId) return;

  const review = await prisma.courseReview.update({
    where: { id: reviewId },
    data: {
      status: "REJECTED",
      comment,
      reviewerId: session.user.id,
    },
    include: { course: true },
  });

  await prisma.course.update({
    where: { id: review.courseId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/reviewer/pending");
  revalidatePath("/reviewer/history");
}
