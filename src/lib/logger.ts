import { LogLevel } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

const SECRET_PATTERNS = [
  "password",
  "pass",
  "pwd",
  "token",
  "secret",
  "authorization",
  "auth",
  "cookie",
  "set-cookie",
  "key",
  "api_key",
  "access_token",
  "refresh_token",
];

function isSensitiveKey(key?: string) {
  if (!key) return false;
  const lower = key.toLowerCase();
  return SECRET_PATTERNS.some((pattern) => lower.includes(pattern));
}

function sanitizeValue(value: unknown, key?: string): unknown {
  if (value === null) {
    return null;
  }
  if (Array.isArray(value)) {
    const sanitized = value
      .map((entry) => sanitizeValue(entry, key))
      .filter((entry) => entry !== undefined);
    return sanitized;
  }
  if (typeof value === "object") {
    const sanitizedObject: Record<string, unknown> = {};
    for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
      const sanitizedChild = sanitizeValue(childValue, childKey);
      if (sanitizedChild !== undefined) {
        sanitizedObject[childKey] = sanitizedChild;
      }
    }
    return sanitizedObject;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    if (isSensitiveKey(key)) {
      return "[REDACTED]";
    }
    return value;
  }
  return value;
}

export function sanitizeLogMeta(
  meta?: unknown
): Prisma.InputJsonValue | undefined {
  if (meta === undefined) return undefined;
  const sanitized = sanitizeValue(meta);
  if (sanitized === undefined) {
    return undefined;
  }
  return sanitized as Prisma.InputJsonValue;
}

export type LogInput = {
  level?: LogLevel;
  action: string;
  message: string;
  userId?: string;
  meta?: unknown;
};

export async function logEvent(input: LogInput) {
  const meta = sanitizeLogMeta(input.meta);
  try {
    await prisma.systemLog.create({
      data: {
        level: input.level ?? LogLevel.INFO,
        action: input.action,
        message: input.message,
        userId: input.userId,
        meta,
      },
    });
  } catch (error) {
    console.warn("logEvent fallback", input, error);
  }
}
