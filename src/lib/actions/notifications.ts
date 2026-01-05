"use server";

import { revalidatePath } from "next/cache";
import { NotificationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guards";
import { ALL_NOTIFICATION_TYPES } from "@/config/notifications";

export async function markAllNotificationsRead() {
  const session = await requireSession();
  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/app/notifications");
}

export async function updateNotificationPreference(formData: FormData) {
  const session = await requireSession();
  const typeInput = String(formData.get("type") ?? "");
  const enabledInput = String(formData.get("enabled") ?? "false");
  if (!typeInput) return;
  if (!ALL_NOTIFICATION_TYPES.includes(typeInput as NotificationType)) return;
  const enabled = enabledInput === "true";
  await prisma.notificationPreference.upsert({
    where: {
      userId_type: { userId: session.user.id, type: typeInput as NotificationType },
    },
    update: {
      enabled,
    },
    create: {
      userId: session.user.id,
      type: typeInput as NotificationType,
      enabled,
    },
  });
  revalidatePath("/app/notifications");
}

export async function markNotificationRead(formData: FormData) {
  const session = await requireSession();
  const notificationId = String(formData.get("notificationId") ?? "");
  if (!notificationId) return;
  await prisma.notification.updateMany({
    where: { id: notificationId, userId: session.user.id },
    data: { isRead: true },
  });
  revalidatePath("/app/notifications");
}
