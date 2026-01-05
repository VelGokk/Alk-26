"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { NotificationType, Role } from "@prisma/client";
import { notifyUser } from "@/lib/notifications";

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

  await notifyUser({
    userId: review.course.instructorId,
    type: NotificationType.REVIEW_APPROVED,
    title: "Course approved",
    body: `Tu curso ${review.course.title} fue aprobado.`,
    referenceId: review.courseId,
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

  await notifyUser({
    userId: review.course.instructorId,
    type: NotificationType.REVIEW_CHANGES_REQUESTED,
    title: "Review requires changes",
    body: `El curso ${review.course.title} necesita ajustes: ${comment}`,
    referenceId: review.courseId,
  });

  revalidatePath("/reviewer/pending");
  revalidatePath("/reviewer/history");
}
