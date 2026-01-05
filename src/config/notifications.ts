import type { NotificationType } from "@prisma/client";

export const NOTIFICATION_BATCH_WINDOW_MINUTES = 10;

export const ALL_NOTIFICATION_TYPES = Object.values(NotificationType);

export const DEFAULT_NOTIFICATION_PREFERENCES: Record<
  NotificationType,
  boolean
> = ALL_NOTIFICATION_TYPES.reduce(
  (acc, type) => ({ ...acc, [type]: true }),
  {} as Record<NotificationType, boolean>
);

export const NOTIFICATION_TYPE_LABEL_KEYS: Record<
  NotificationType,
  string
> = {
  REVIEW_REQUESTED: "dashboard.notificationTypeReviewRequested",
  REVIEW_APPROVED: "dashboard.notificationTypeReviewApproved",
  REVIEW_CHANGES_REQUESTED: "dashboard.notificationTypeReviewChangesRequested",
  CERTIFICATE_READY: "dashboard.notificationTypeCertificateReady",
  EVENT: "dashboard.notificationTypeEvent",
};
