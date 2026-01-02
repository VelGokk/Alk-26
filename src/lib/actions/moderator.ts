"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export async function resolveReport(formData: FormData) {
  const session = await requireRole([Role.MODERATOR, Role.SUPERADMIN]);
  const reportId = String(formData.get("reportId") ?? "");
  const actionType = String(formData.get("actionType") ?? "RESOLVE");
  const note = String(formData.get("note") ?? "");
  if (!reportId) return;

  await prisma.moderationAction.create({
    data: {
      reportId,
      actionType: actionType as "HIDE" | "WARN" | "RESOLVE",
      note,
      moderatorId: session.user.id,
    },
  });

  await prisma.moderationReport.update({
    where: { id: reportId },
    data: { status: "RESOLVED" },
  });

  revalidatePath("/moderator/reports");
}
