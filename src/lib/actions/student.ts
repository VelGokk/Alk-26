"use server";

import { revalidatePath } from "next/cache";
import { NotificationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guards";
import { notifyUser } from "@/lib/notifications";
import { deliverEmail } from "@/lib/email";
import { certificateReadyTemplate } from "@/emails/templates/transactional";
import { ensureCertificateForEnrollment } from "@/lib/certificates";

export async function toggleLessonComplete(formData: FormData) {
  const session = await requireSession();
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  if (!enrollmentId || !lessonId) return;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true },
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

  if (progressPercent >= 100) {
    await ensureCertificateForEnrollment(enrollmentId);
    await notifyUser({
      userId: session.user.id,
      type: NotificationType.CERTIFICATE_READY,
      title: "Certificado disponible",
      body: `Completaste el curso ${enrollment?.course?.title ?? ""}. Revisa tu panel de certificados.`,
      referenceId: enrollmentId,
    });
    if (enrollment?.course && session.user.email) {
      await deliverEmail({
        to: session.user.email,
        subject: "Certificado listo",
        html: certificateReadyTemplate({
          nombre: session.user.name ?? session.user.email,
          curso: enrollment.course.title,
        }),
      });
    }
  }

  revalidatePath("/app/my-courses");
}
