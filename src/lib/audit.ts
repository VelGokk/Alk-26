import { LogLevel } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logEvent, sanitizeLogMeta } from "@/lib/logger";

export type AuditInput = {
  action: string;
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  status?: string;
  source?: string;
  ip?: string;
  userAgent?: string;
  metadata?: unknown;
  level?: LogLevel;
};

export async function auditEvent(input: AuditInput) {
  const meta = sanitizeLogMeta(input.metadata);
  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        userId: input.userId,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        status: input.status,
        source: input.source,
        ip: input.ip,
        userAgent: input.userAgent,
        metadata: meta as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.warn("auditEvent fallback", input, error);
  }

  await logEvent({
    action: input.action,
    message: `${input.action} ${input.resourceType ?? ""} ${input.resourceId ?? ""}`.trim(),
    userId: input.userId,
    level: input.level ?? LogLevel.INFO,
    meta,
  });
}
