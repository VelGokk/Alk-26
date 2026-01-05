"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type LegalComplianceLabels = {
  overlayTitle: string;
  overlayBody: string;
  checkboxLabel: string;
  acceptButton: string;
  signingLabel: string;
  errorRequired: string;
  errorMessage: string;
};

type LegalDocumentPayload = {
  id: string;
  title: string;
  content: string;
  versionNumber: number;
};

export default function LegalComplianceOverlay({
  document,
  labels,
}: {
  document: LegalDocumentPayload | null;
  labels: LegalComplianceLabels;
}) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!document || isSigned) {
    return null;
  }

  const handleAccept = async () => {
    if (!accepted) {
      setError(labels.errorRequired);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/legal/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: document.id }),
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? labels.errorMessage);
      }
      setIsSigned(true);
      router.refresh();
    } catch (err) {
      setError((err as Error).message ?? labels.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4">
      <div className="flex w-full max-w-3xl flex-col gap-6 overflow-hidden rounded-[32px] border border-black/10 bg-white px-6 py-8 text-justify">
        <header className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            {labels.overlayTitle}
          </p>
          <h2 className="text-2xl font-semibold text-ink">{document.title}</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            {`v${document.versionNumber}`}
          </p>
          <p className="text-sm text-slate-600">{labels.overlayBody}</p>
        </header>
        <div className="max-h-[60vh] overflow-auto rounded-2xl border border-black/5 bg-slate-50 p-4 text-sm text-slate-700 shadow-inner">
          <div
            className="space-y-3"
            dangerouslySetInnerHTML={{ __html: document.content }}
          />
        </div>
        <div className="space-y-3 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => {
                setAccepted(event.target.checked);
                if (event.target.checked) {
                  setError(null);
                }
              }}
              className="h-4 w-4 accent-ink"
            />
            <span>{labels.checkboxLabel}</span>
          </label>
          {error && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={handleAccept}
            disabled={!accepted || isSubmitting}
            className="w-full rounded-full bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition disabled:opacity-50"
          >
            {isSubmitting ? labels.signingLabel : labels.acceptButton}
          </button>
        </div>
      </div>
    </div>
  );
}
