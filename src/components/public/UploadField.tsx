"use client";

import { useState } from "react";

type UploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string | null;
};

export default function UploadField({
  name,
  label,
  defaultValue,
}: UploadFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (data?.url) {
      setValue(data.url);
    }
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </label>
      <input type="hidden" name={name} value={value} />
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
      />
      <input type="file" onChange={handleFileChange} />
      {uploading ? (
        <p className="text-xs text-zinc-500">Subiendo...</p>
      ) : null}
    </div>
  );
}
