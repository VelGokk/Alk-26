"use server";

import { Prisma, NotificationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  ALL_NOTIFICATION_TYPES,
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_BATCH_WINDOW_MINUTES,
} from "@/config/notifications";

const BATCH_WINDOW_MS = NOTIFICATION_BATCH_WINDOW_MINUTES * 60_000;

export type NotificationPayload = {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
};

async function ensurePreferences(userId: string) {
  const existing = await prisma.notificationPreference.findMany({
    where: { userId },
    select: { type: true },
  });
  const present = new Set(existing.map((entry) => entry.type));
  const missing = ALL_NOTIFICATION_TYPES.filter((type) => !present.has(type));
  if (missing.length === 0) {
    return;
  }
  await prisma.notificationPreference.createMany({
    data: missing.map((type) => ({
      userId,
      type,
      enabled: DEFAULT_NOTIFICATION_PREFERENCES[type],
    })),
    skipDuplicates: true,
  });
}

export async function isNotificationEnabled(
  userId: string,
  type: NotificationType
): Promise<boolean> {
  await ensurePreferences(userId);
  const preference = await prisma.notificationPreference.findUnique({
    where: { userId_type: { userId, type } },
  });
  return preference?.enabled ?? true;
}

export async function createNotification(
  payload: NotificationPayload
): Promise<Prisma.PromiseReturnType<typeof prisma.notification.create> | null> {
  if (!(await isNotificationEnabled(payload.userId, payload.type))) {
    return null;
  }
  const windowStart = new Date(Date.now() - BATCH_WINDOW_MS);
  const existingFilter: Prisma.NotificationWhereInput = {
    userId: payload.userId,
    type: payload.type,
    createdAt: { gte: windowStart },
  };
  if (payload.referenceId) {
    existingFilter.referenceId = payload.referenceId;
  }
  const recent = await prisma.notification.findFirst({
    where: existingFilter,
    orderBy: { createdAt: "desc" },
  });
  if (recent) {
    return recent;
  }

  return prisma.notification.create({
    data: {
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      referenceId: payload.referenceId,
      metadata: payload.metadata,
    },
  });
}

export async function notifyUser(payload: NotificationPayload) {
  return createNotification(payload);
}

export async function notifyEvent(
  userId: string,
  title: string,
  body: string,
  options?: { referenceId?: string; metadata?: Record<string, unknown> }
) {
  return createNotification({
    userId,
    type: NotificationType.EVENT,
    title,
    body,
    referenceId: options?.referenceId,
    metadata: options?.metadata,
  });
}
