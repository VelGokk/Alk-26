"use client";

import { LogLevel } from "@prisma/client";
import { logEvent } from "@/lib/logger";
import { ErrorFallback } from "@/components/error/ErrorFallback";

type ErrorProps = {
  error: Error;
  reset?: () => void;
};

export default async function GlobalError({ error, reset }: ErrorProps) {
  await logEvent({
    action: "app.errorBoundary",
    message: error.message,
    level: LogLevel.ERROR,
    meta: {
      stack: error.stack,
    },
  });

  return <ErrorFallback reset={reset} />;
}
