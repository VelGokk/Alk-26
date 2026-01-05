"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { AppLocale } from "@/config/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/config/i18n";
import { paths } from "@/config/paths";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guards";
import { logEvent } from "@/lib/logger";

function resolveLang(value?: string | null): AppLocale {
  if (isLocale(value ?? undefined)) {
    return value as AppLocale;
  }
  return DEFAULT_LOCALE;
}

function getClientIp(headerStoreParam?: ReturnType<typeof headers>) {
  const headerStore = headerStoreParam ?? headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (
    headerStore.get("x-real-ip") ||
    headerStore.get("x-forwarded") ||
    undefined
  );
}

export async function createComment(formData: FormData) {
  const session = await requireSession();
  const content = String(formData.get("content") ?? "").trim();
  const lessonId = String(formData.get("lessonId") ?? "");
  const resourceId = String(formData.get("resourceId") ?? "");
  const rawLang = String(formData.get("lang") ?? "");
  if (!content || (!lessonId && !resourceId)) return;

  const targetType = lessonId ? "LESSON" : "RESOURCE";
  const headerStore = headers();
  const clientIp = getClientIp(headerStore);
  const userAgent = headerStore.get("user-agent") ?? undefined;

  const comment = await prisma.comment.create({
    data: {
      content,
      userId: session.user.id,
      targetType,
      lessonId: lessonId || undefined,
      resourceId: resourceId || undefined,
      clientIp,
      userAgent,
    },
  });

  await logEvent({
    action: "comments.create",
    message: "Nuevo comentario creado",
    userId: session.user.id,
    meta: {
      commentId: comment.id,
      targetType,
      lessonId,
      resourceId,
    },
  });

  const lang = resolveLang(rawLang);
  if (lessonId) {
    const lesson = await prisma.programLesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            program: true,
          },
        },
      },
    });
    const programSlug = lesson?.module?.program?.slug;
    if (programSlug) {
      revalidatePath(paths.public.programLesson(lang, programSlug, lessonId));
    }
  }

  if (resourceId) {
    const resource = await prisma.programResource.findUnique({
      where: { id: resourceId },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                program: true,
              },
            },
          },
        },
      },
    });
    const programSlug = resource?.lesson?.module?.program?.slug;
    const lessonIdFromResource = resource?.lesson?.id;
    if (programSlug && lessonIdFromResource) {
      revalidatePath(
        paths.public.programLesson(lang, programSlug, lessonIdFromResource)
      );
    }
  }
}

export async function reportComment(formData: FormData) {
  const session = await requireSession();
  const commentId = String(formData.get("commentId") ?? "");
  const reason = String(formData.get("reason") ?? "spam");
  if (!commentId) return;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              program: true,
            },
          },
        },
      },
      resource: {
        include: {
          lesson: {
            include: {
              module: {
                include: {
                  program: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!comment) return;

  const report = await prisma.moderationReport.create({
    data: {
      targetType: "COMMENT",
      targetId: comment.id,
      reason,
      reporterId: session.user.id,
      commentId: comment.id,
      status: "OPEN",
      details: { reportedFor: reason },
    },
  });

  await logEvent({
    action: "comments.report",
    message: "Reporte de comentario recibido",
    userId: session.user.id,
    meta: {
      reportId: report.id,
      commentId,
      reason,
    },
  });

  revalidatePath("/moderator/reports");
}
