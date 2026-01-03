import { LogLevel } from "@prisma/client";
import { prisma } from "./prisma";

type LogInput = {
  level?: LogLevel;
  action: string;
  message: string;
  userId?: string;
  meta?: Record<string, unknown>;
};

export async function logEvent(input: LogInput) {
  try {
    await prisma.systemLog.create({
      data: {
        level: input.level ?? LogLevel.INFO,
        action: input.action,
        message: input.message,
        userId: input.userId,
        meta: input.meta as any,
      },
    });
  } catch (error) {
    console.warn("logEvent fallback", input, error);
  }
}
