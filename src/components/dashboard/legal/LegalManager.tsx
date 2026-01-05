"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Role } from "@prisma/client";
import { ROLE_LABELS } from "@/lib/constants";
import RichTextEditor from "./RichTextEditor";

type LegalDocumentRecord = {
  id: string;
  title: string;
  content: string;
  versionNumber: number;
  isActive: boolean;
  createdAt: string;
  roleTarget: Role;
};

export type LegalLabels = {
  heading: string;
  subheading: string;
  roleLabel: string;
  roleHelp: string;
  titleLabel: string;
  contentLabel: string;
  editorHelp: string;
  publishButton: string;
  previewLabel: string;
  previewHint: string;
  versionsLabel: string;
  historyLabel: string;
  activeBadge: string;
  inactiveBadge: string;
  successMessage: string;
  errorMessage: string;
  emptyState: string;
  pendingNotice: string;
  loadingLabel: string;
};

const ROLES = Object.values(Role) as Role[];

export default function LegalManager({
  labels,
}: {
  labels: LegalLabels;
}) {
  const [selectedRole, setSelectedRole] = useState<Role>(Role.SUPERADMIN);
  const [documents, setDocuments] = useState<LegalDocumentRecord[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const activeDocument = useMemo(
    () => documents.find((doc) => doc.isActive),
    [documents]
  );

  const versionHistory = useMemo(
    () =>
      [...documents].sort((a, b) => b.versionNumber - a.versionNumber),
    [documents]
  );

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/legal/documents?role=${selectedRole}`,
        {
          cache: "no-store",
          headers: { Accept: "application/json" },
          credentials: "include",
        }
      );
      const payload: LegalDocumentRecord[] = await response.json();
      if (!response.ok) {
        throw new Error(
          (payload as unknown as { error?: string })?.error ??
            labels.errorMessage
        );
      }
      setDocuments(payload);
    } catch (error) {
      setAlert({
        type: "error",
        message:
          (error as Error).message ?? labels.errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [labels.errorMessage, selectedRole]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    if (activeDocument) {
      setTitle(activeDocument.title);
      setContent(activeDocument.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [activeDocument?.id]);

  useEffect(() => {
    setAlert(null);
  }, [selectedRole]);

  const handlePublish = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setAlert({
        type: "error",
        message: labels.errorMessage,
      });
      return;
    }
    if (!content.trim()) {
      setAlert({
        type: "error",
        message: labels.errorMessage,
      });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);
    try {
      const response = await fetch("/api/legal/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          roleTarget: selectedRole,
          title: trimmedTitle,
          content,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? labels.errorMessage);
      }
      setAlert({
        type: "success",
        message: `${labels.successMessage} #${payload.version ?? ""}`,
      });
      await fetchDocuments();
    } catch (error) {
      setAlert({
        type: "error",
        message: (error as Error).message ?? labels.errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewContent = content || activeDocument?.content || "";
  const previewTitle = title || activeDocument?.title || labels.heading;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="space-y-4 rounded-2xl border border-black/10 bg-white/60 p-6 shadow-soft">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              {labels.roleLabel}
            </p>
            <select
              value={selectedRole}
              onChange={(event) =>
                setSelectedRole(event.target.value as Role)
              }
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role] ?? role}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">{labels.roleHelp}</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              {labels.titleLabel}
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                {labels.contentLabel}
              </p>
              <p className="text-xs text-slate-500">{labels.editorHelp}</p>
            </div>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {labels.pendingNotice}
            </p>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting || isLoading}
              className="rounded-full bg-ink px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition disabled:opacity-60"
            >
              {isSubmitting ? `${labels.publishButton}...` : labels.publishButton}
            </button>
          </div>
        </section>
        <section className="space-y-6">
          <div className="space-y-2 rounded-2xl border border-black/10 bg-white/60 p-6 shadow-soft">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              {labels.previewLabel}
            </p>
            <p className="text-sm text-slate-500">{labels.previewHint}</p>
            <div className="mt-4 w-full max-w-[360px] rounded-[28px] border border-black/5 bg-black/80 p-4 text-xs text-white shadow-lg">
              <div className="min-h-[420px] rounded-2xl bg-white p-4 text-sm text-slate-800">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  {previewTitle}
                </p>
                <div
                  className="mt-2 space-y-2"
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl border border-black/10 bg-white/60 p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {labels.versionsLabel}
                </p>
                <p className="text-sm font-semibold text-ink">
                  {labels.historyLabel}
                </p>
              </div>
              <span className="text-xs text-slate-500">
                {versionHistory.length} registros
              </span>
            </div>
            {alert && (
              <div
                className={`rounded-2xl border px-3 py-2 text-xs ${
                  alert.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {alert.message}
              </div>
            )}
            {isLoading ? (
              <p className="text-sm text-slate-500">{labels.loadingLabel}</p>
            ) : versionHistory.length === 0 ? (
              <p className="text-sm text-slate-500">{labels.emptyState}</p>
            ) : (
              versionHistory.map((doc) => (
                <article
                  key={`${doc.id}-${doc.versionNumber}`}
                  className="space-y-1 rounded-2xl border border-black/5 p-3 text-sm text-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      {labels.versionsLabel} #{doc.versionNumber}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] ${
                        doc.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {doc.isActive
                        ? labels.activeBadge
                        : labels.inactiveBadge}
                    </span>
                  </div>
                  <p className="font-semibold text-ink">{doc.title}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {new Date(doc.createdAt).toLocaleString()}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
