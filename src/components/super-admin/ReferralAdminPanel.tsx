 "use client";

import { useState, type FormEvent } from "react";
import { AppDictionary } from "@/config/i18n";
import { formatReferralUrl } from "@/config/referrals";

type ReferralCodeRow = {
  id: string;
  code: string;
  label?: string | null;
  description?: string | null;
  rewardPoints: number;
  isActive: boolean;
  createdAt: string;
  usageCount: number;
};

type ReferralAdminPanelProps = {
  dictionary: AppDictionary;
  initialCodes: ReferralCodeRow[];
  locale: string;
};

export function ReferralAdminPanel({
  dictionary,
  initialCodes,
  locale,
}: ReferralAdminPanelProps) {
  const [codes, setCodes] = useState(initialCodes);
  const [form, setForm] = useState({
    label: "",
    description: "",
    rewardPoints: "120",
    code: "",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const rewardValue = Number(form.rewardPoints);
    const payload: Record<string, unknown> = {
      label: form.label.trim() || undefined,
      description: form.description.trim() || undefined,
      isActive: form.isActive,
      code: form.code.trim() || undefined,
    };
    if (!Number.isNaN(rewardValue)) {
      payload.rewardPoints = rewardValue;
    }

    try {
      const response = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "Error");
      } else {
        setCodes((prev) => [
          {
            id: data.id,
            code: data.code,
            label: data.label,
            description: data.description,
            rewardPoints: data.rewardPoints,
            isActive: data.isActive,
            createdAt: data.createdAt,
            usageCount: 0,
          },
          ...prev,
        ]);
        setForm((prevState) => ({ ...prevState, label: "", description: "", code: "" }));
      }
    } catch (err) {
      setError("No fue posible crear el código.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));

  return (
    <section className="space-y-6 rounded-3xl border border-black/10 bg-white/90 p-5 shadow-soft">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {dictionary.dashboard.referralAdminTitle}
        </p>
        <h2 className="font-heading text-2xl text-ink">
          {dictionary.dashboard.referralAdminSubtitle}
        </h2>
        <p className="text-sm text-zinc-600">
          {dictionary.dashboard.referralAdminFormHint}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="space-y-1 text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralAdminFormLabel}
            <input
              value={form.label}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, label: event.target.value }))
              }
              placeholder={dictionary.dashboard.referralAdminFormLabel}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1 text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralAdminFormDescription}
            <input
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder={dictionary.dashboard.referralAdminFormDescription}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1 text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralAdminFormReward}
            <input
              value={form.rewardPoints}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, rewardPoints: event.target.value }))
              }
              type="number"
              min={0}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1 text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralAdminFormCode}
            <input
              value={form.code}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, code: event.target.value }))
              }
              placeholder={dictionary.dashboard.referralAdminFormCode}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>
        <label className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, isActive: event.target.checked }))
            }
          />
          {dictionary.dashboard.referralAdminFormActive}
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.3em] text-white disabled:opacity-40"
        >
          {dictionary.dashboard.referralAdminFormSubmit}
        </button>
        {error ? (
          <p className="text-sm text-ember">{error}</p>
        ) : null}
      </form>

      <div className="space-y-3">
        {codes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-black/10 px-4 py-3 text-sm text-zinc-600">
            {dictionary.dashboard.referralAdminEmpty}
          </p>
        ) : (
          codes.map((code) => (
            <article
              key={code.id}
              className="glass-panel space-y-2 rounded-2xl border border-white/5 p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {dictionary.dashboard.referralAdminTableCode}
                  </p>
                  <p className="font-heading text-lg text-ink">{code.code}</p>
                </div>
                <div
                  className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.3em] ${
                    code.isActive
                      ? "border-emerald-500 text-emerald-500"
                      : "border-zinc-400 text-zinc-500"
                  }`}
                >
                  {code.isActive
                    ? dictionary.dashboard.referralAdminStatusActive
                    : dictionary.dashboard.referralAdminStatusInactive}
                </div>
              </div>

              <p className="text-sm text-zinc-600">
                {code.label ?? dictionary.dashboard.referralAdminTableLabel}
              </p>
              <p className="text-sm text-zinc-500">
                {dictionary.dashboard.referralAdminTableReward}:{" "}
                <strong>{code.rewardPoints}</strong> ·{" "}
                {dictionary.dashboard.referralAdminTableUsage}: {code.usageCount}
              </p>
              <p className="text-sm text-zinc-500">
                {dictionary.dashboard.referralAdminTableCreated}:{" "}
                {formatDate(code.createdAt)}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
                <a
                  href={formatReferralUrl(code.code, locale)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/10 px-3 py-1 transition hover:border-ink hover:text-ink"
                >
                  {dictionary.dashboard.referralAdminShareLink}
                </a>
                <span>{code.description ?? ""}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
