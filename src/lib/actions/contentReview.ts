"use server";

import { revalidatePath } from "next/cache";
import type { ContentReviewState } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { logEvent } from "@/lib/logger";
import { paths } from "@/config/paths";
import { SUPPORTED_LOCALES } from "@/config/i18n";
import {
  REVIEW_CHECKLIST,
  REVIEW_TRANSITIONS,
  REVIEW_STATUS_FLOW,
  type ReviewChecklistState,
} from "@/config/review";

function parseChecklist(formData: FormData): ReviewChecklistState {
  const state = {} as ReviewChecklistState;
  for (const item of REVIEW_CHECKLIST) {
    const value = formData.get(`checklist.${item.id}`);
    state[item.id] = value === "true" || value === "on";
  }
  return state;
}

function isValidStatus(status: string): status is ContentReviewState {
  return REVIEW_STATUS_FLOW.includes(status as ContentReviewState);
}

const REVIEWER_PATHS = SUPPORTED_LOCALES.map((locale) =>
  paths.dashboard.section(locale, "reviewer")
);
const INSTRUCTOR_COURSES_PATHS = SUPPORTED_LOCALES.map(
  (locale) => `${paths.dashboard.section(locale, "instructor")}/courses`
);

export async function submitLessonForReview(formData: FormData) {
  const session = await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const lessonId = String(formData.get("lessonId") ?? "");
  const summary = String(formData.get("summary") ?? "");
  if (!lessonId) return;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } },
  });
  if (!lesson) return;
  if (
    session.user.role !== Role.SUPERADMIN &&
    lesson.module.course.instructorId !== session.user.id
  ) {
    return;
  }

  const reviewer = await prisma.user.findFirst({
    where: { role: Role.REVIEWER, isActive: true },
  });

  const review = await prisma.contentReview.upsert({
    where: {
      lessonId_instructorId: {
        lessonId,
        instructorId: session.user.id,
      },
    },
    update: {
      status: "PENDING",
      summary: summary || undefined,
      reviewerId: reviewer?.id ?? session.user.id,
    },
    create: {
      lessonId,
      instructorId: session.user.id,
      reviewerId: reviewer?.id ?? session.user.id,
      status: "PENDING",
      summary: summary || undefined,
    },
  });

  await prisma.reviewDecision.create({
    data: {
      reviewId: review.id,
      state: review.status,
      checklist: review.checklist ?? {},
      notes: summary || "Review requested",
      createdById: reviewer?.id ?? session.user.id,
    },
  });

  await logEvent({
    action: "review.requested",
    message: `Lesson ${lesson.title} requested for review`,
    userId: session.user.id,
    meta: {
      lessonId,
      reviewId: review.id,
      instructorId: session.user.id,
    },
  });

  for (const path of REVIEWER_PATHS) {
    revalidatePath(path);
  }
  for (const path of INSTRUCTOR_COURSES_PATHS) {
    revalidatePath(path);
  }
}

export async function transitionContentReview(formData: FormData) {
  const session = await requireRole([Role.REVIEWER, Role.SUPERADMIN]);
  const reviewId = String(formData.get("reviewId") ?? "");
  const notes = String(formData.get("notes") ?? "");
  const rawStatus = formData.get("status");
  if (!reviewId || typeof rawStatus !== "string") return;
  if (!isValidStatus(rawStatus)) return;
  const targetStatus = rawStatus as ContentReviewState;

  const review = await prisma.contentReview.findUnique({
    where: { id: reviewId },
    include: { lesson: { include: { module: { include: { course: true } } } }, instructor: true },
  });
  if (!review) return;

  const allowed = REVIEW_TRANSITIONS[review.status] ?? [];
  if (review.status !== targetStatus && !allowed.includes(targetStatus)) {
    return;
  }

  const checklistState = parseChecklist(formData);

  if (
    (targetStatus === "APPROVED" || targetStatus === "PUBLISHED") &&
    REVIEW_CHECKLIST.some((item) => !checklistState[item.id])
  ) {
    throw new Error("Checklist incomplete");
  }

  await prisma.contentReview.update({
    where: { id: reviewId },
    data: {
      status: targetStatus,
      reviewerId: session.user.id,
      summary: notes || review.summary,
      checklist: checklistState,
    },
  });

  await prisma.reviewDecision.create({
    data: {
      reviewId,
      state: targetStatus,
      checklist: checklistState,
      notes,
      createdById: session.user.id,
    },
  });

  await logEvent({
    action: "review.status",
    message: `Lesson ${review.lesson.title} moved to ${targetStatus}`,
    userId: session.user.id,
    meta: {
      lessonId: review.lessonId,
      reviewId,
      instructorId: review.instructorId,
      status: targetStatus,
    },
  });

  for (const path of REVIEWER_PATHS) {
    revalidatePath(path);
  }
  for (const path of INSTRUCTOR_COURSES_PATHS) {
    revalidatePath(path);
  }
}

export async function addReviewFeedback(formData: FormData) {
  const session = await requireRole([Role.REVIEWER, Role.SUPERADMIN]);
  const reviewId = String(formData.get("reviewId") ?? "");
  const message = String(formData.get("message") ?? "");
  const anchor = String(formData.get("anchor") ?? "");
  if (!reviewId || !message) return;

  const review = await prisma.contentReview.findUnique({
    where: { id: reviewId },
    include: { lesson: { include: { module: { include: { course: true } } } } },
  });
  if (!review) return;

  await prisma.reviewFeedback.create({
    data: {
      reviewId,
      authorId: session.user.id,
      anchor: anchor || null,
      message,
    },
  });

  await logEvent({
    action: "review.feedback",
    message: `Feedback added for lesson ${review.lesson.title}`,
    userId: session.user.id,
    meta: {
      lessonId: review.lessonId,
      reviewId,
      instructorId: review.instructorId,
    },
  });

  for (const path of REVIEWER_PATHS) {
    revalidatePath(path);
  }
}
