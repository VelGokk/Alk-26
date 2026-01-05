"use server";

import { revalidatePath } from "next/cache";
import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { DEFAULT_LOCALE } from "@/config/i18n";
import { paths } from "@/config/paths";
import { logEvent } from "@/lib/logger";

type ModeratorActionType = "HIDE" | "WARN" | "RESOLVE" | "DELETE" | "BAN";

export async function resolveReport(formData: FormData) {
  const session = await requireRole([Role.MODERATOR, Role.SUPERADMIN]);
  const reportId = String(formData.get("reportId") ?? "");
  const actionType = (String(formData.get("actionType") ?? "RESOLVE") ||
    "RESOLVE") as ModeratorActionType;
  const note = String(formData.get("note") ?? "");
  const banMinutes = Number(formData.get("banMinutes") ?? 0);
  if (!reportId) return;

  const report = await prisma.moderationReport.findUnique({
    where: { id: reportId },
    include: {
      comment: {
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
      },
    },
  });
  if (!report) return;

  const mutations = [];
  if (report.comment && ["HIDE", "DELETE"].includes(actionType)) {
    const commentData: Prisma.CommentUpdateInput = {};
    if (actionType === "HIDE") {
      commentData.isHidden = true;
    }
    if (actionType === "DELETE") {
      commentData.isDeleted = true;
    }
    if (Object.keys(commentData).length > 0) {
      mutations.push(
        prisma.comment.update({
          where: { id: report.comment!.id },
          data: commentData,
        })
      );
    }
  }

  let banExpiresAt: Date | undefined;
  if (
    actionType === "BAN" &&
    banMinutes > 0 &&
    report.comment?.userId
  ) {
    banExpiresAt = new Date(Date.now() + banMinutes * 60_000);
    mutations.push(
      prisma.user.update({
        where: { id: report.comment.userId },
        data: { suspendedUntil: banExpiresAt },
      })
    );
  }

  mutations.push(
    prisma.moderationAction.create({
      data: {
        reportId,
        actionType,
        note: note || undefined,
        moderatorId: session.user.id,
        subjectUserId: report.comment?.userId,
        expiresAt: banExpiresAt,
        details:
          actionType === "BAN"
            ? { banMinutes }
            : actionType === "DELETE"
            ? { deleted: true }
            : actionType === "HIDE"
            ? { hidden: true }
            : undefined,
      },
    })
  );

  mutations.push(
    prisma.moderationReport.update({
      where: { id: reportId },
      data: {
        status: "RESOLVED",
        resolvedAt: new Date(),
        details: {
          actionType,
          reason: report.reason,
        },
      },
    })
  );

  await prisma.$transaction(mutations);

  await logEvent({
    action: "moderation.resolve",
    message: `Moderation action ${actionType} applied`,
    userId: session.user.id,
    meta: {
      reportId,
      actionType,
      commentId: report.comment?.id,
    },
  });

  const programSlug =
    report.comment?.lesson?.module?.program?.slug ||
    report.comment?.resource?.lesson?.module?.program?.slug;
  const lessonId =
    report.comment?.lesson?.id || report.comment?.resource?.lesson?.id;
  if (programSlug && lessonId) {
    revalidatePath(
      paths.public.programLesson(DEFAULT_LOCALE, programSlug, lessonId)
    );
  }

  revalidatePath("/moderator/reports");
}
