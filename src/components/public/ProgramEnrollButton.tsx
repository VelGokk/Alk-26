"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProgramEnrollButtonProps = {
  slug: string;
  label: string;
  successLabel: string;
};

export default function ProgramEnrollButton({
  slug,
  label,
  successLabel,
}: ProgramEnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/programs/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Enrollment failed");
      }
      setDone(true);
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
        onClick={handleEnroll}
        disabled={loading || done}
        className="rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition disabled:opacity-60"
      >
        {loading ? "..." : done ? successLabel : label}
      </button>
      {error ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
