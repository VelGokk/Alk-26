"use client";

import { useEffect, useRef } from "react";

const COMMANDS = [
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "U", command: "underline" },
  { label: "•", command: "insertUnorderedList" },
] as const;

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const applyCommand = (command: string) => {
    if (typeof document === "undefined") return;
    document.execCommand(command);
    ref.current?.focus();
    onChange(ref.current?.innerHTML ?? "");
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-black/5 bg-slate-50 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-500">
        {COMMANDS.map((item) => (
          <button
            key={item.command}
            type="button"
            onClick={() => applyCommand(item.command)}
            className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-black/30 hover:text-ink"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        className="min-h-[220px] p-4 text-sm text-slate-700 outline-none"
      />
    </div>
  );
}
