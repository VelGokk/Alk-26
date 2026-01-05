"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <button
        type="button"
        disabled={completed || loading}
        onClick={handleComplete}
        className="flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-ink transition hover:border-black/30 disabled:bg-slate-100 disabled:text-slate-400"
      >
        {loading ? "..." : completed ? completedLabel : label}
      </button>
      {error ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
