"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ProgramLessonCompleteButtonProps = {
  lessonId: string;
  completed: boolean;
  label: string;
  completedLabel: string;
};

export default function ProgramLessonCompleteButton({
  lessonId,
  completed,
  label,
  completedLabel,
}: ProgramLessonCompleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    if (completed) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/programs/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Completion failed");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="space-y-2">
        <Button
          type="button"
          size="default"
          variant={completed ? "ghost" : "outline"}
          disabled={completed || loading}
          onClick={handleComplete}
          className="w-full"
        >
          {loading ? "..." : completed ? completedLabel : label}
        </Button>
        {error ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
