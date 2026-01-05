"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  programId: string;
  initialLogId?: string;
  initialContent?: string;
  initialIsPrivate?: boolean;
  canUseAI?: boolean;
};

export default function OntologicalLogEditor({
  programId,
  initialLogId,
  initialContent = "",
  initialIsPrivate = false,
  canUseAI = true,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [logId, setLogId] = useState(initialLogId);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
  const [status, setStatus] = useState("Guardado");
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [mirrorState, setMirrorState] = useState<"idle" | "loading" | "error">(
    "idle"
  );
  const [mirrorError, setMirrorError] = useState<string | null>(null);

  const pendingSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(initialContent);

  useEffect(() => {
    if (initialContent !== undefined) {
      lastSavedRef.current = initialContent;
      setContent(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    if (content === lastSavedRef.current) return;
    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current);
    }
    setSaving(true);
    setStatus("Guardando...");
    pendingSaveRef.current = setTimeout(() => {
      void saveLog();
    }, 1200);
    return () => {
      if (pendingSaveRef.current) {
        clearTimeout(pendingSaveRef.current);
      }
    };
  }, [content, isPrivate, programId]);

  const saveLog = async () => {
    if (!programId) return;
    try {
      const response = await fetch("/api/ontological-log/autosave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId,
          content,
          isPrivate,
        }),
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "No se pudo guardar");
      }
      setLogId(payload.id);
      lastSavedRef.current = content;
      setStatus("Guardado");
    } catch (error) {
      setStatus("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const requestMirror = async () => {
    if (!content.trim() || !programId || mirrorState === "loading") return;
    if (!canUseAI || isPrivate) {
      setMirrorError("IA desactivada. Activa la privacidad para permitir respuestas.");
      setMirrorState("error");
      return;
    }
    setMirrorState("loading");
    setMirrorError(null);
    try {
      const response = await fetch("/api/ai-mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          logId,
          programId,
          isPrivate,
        }),
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Fallo del espejo");
      }
      if (Array.isArray(payload.questions)) {
        setQuestions(payload.questions);
      } else {
        setQuestions([]);
      }
      setMirrorState("idle");
    } catch (error) {
      setMirrorState("error");
      setMirrorError((error as Error).message ?? "Error del espejo");
    }
  };

  const handlePrivacyChange = (value: boolean) => {
    setIsPrivate(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Bitácora ontológica
          </p>
          <span
            aria-live="polite"
            className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500"
          >
            {saving ? "Guardando..." : status}
          </span>
        </div>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={6}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/20"
          placeholder="Escribí lo que estás viendo, sintiendo o preocupándote..."
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-500">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(event) => handlePrivacyChange(event.target.checked)}
            className="h-4 w-4 rounded border border-black/10 accent-ink"
          />
          Privacidad activada
        </label>
        <button
          type="button"
          onClick={requestMirror}
          disabled={
            mirrorState === "loading" ||
            !content.trim() ||
            !canUseAI ||
            isPrivate
          }
          className="rounded-full bg-ink px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition disabled:opacity-50"
        >
          {mirrorState === "loading" ? "Procesando..." : "Pedir espejo"}
        </button>
      </div>
      {!canUseAI ? (
        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400">
          IA no configurada. Contactá al equipo para habilitarla.
        </p>
      ) : null}
      {isPrivate ? (
        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400">
          La privacidad impide enviar el contenido al espejo.
        </p>
      ) : null}
      {mirrorError ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
          {mirrorError}
        </p>
      ) : null}
      {questions.length > 0 ? (
        <ul className="space-y-2 rounded-2xl border border-black/10 bg-white/80 p-4 text-sm text-slate-700">
          {questions.map((question, index) => (
            <li key={`${question}-${index}`} className="list-decimal pl-5">
              {question}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
