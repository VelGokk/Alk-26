"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guards";

export async function toggleLessonComplete(formData: FormData) {
  const session = await requireSession();
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  if (!enrollmentId || !lessonId) return;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });
  if (!enrollment || enrollment.userId !== session.user.id) return;

  await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: { enrollmentId, lessonId },
    },
    update: { completed: true, completedAt: new Date() },
    create: { enrollmentId, lessonId, completed: true, completedAt: new Date() },
  });

  const totalLessons = await prisma.lesson.count({
    where: { module: { course: { enrollments: { some: { id: enrollmentId } } } } },
  });

  const completedLessons = await prisma.lessonProgress.count({
    where: { enrollmentId, completed: true },
  });

  const progressPercent = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { progressPercent },
  });

  revalidatePath("/app/my-courses");
}
