"use client";

import { useState } from "react";
import { AppDictionary } from "@/config/i18n";
import type { ReferralStats } from "@/lib/referrals";

type ReferralPanelProps = {
  dictionary: AppDictionary;
  stats: ReferralStats;
  referralPoints: number;
  locale: string;
};

const DATE_FORMATTER = (locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" });

export function ReferralPanel({
  dictionary,
  stats,
  referralPoints,
  locale,
}: ReferralPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(stats.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="space-y-6 rounded-3xl border border-black/10 bg-white/80 p-5 shadow-soft">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {dictionary.dashboard.referralLabel}
        </p>
        <h2 className="font-heading text-2xl text-ink">
          {dictionary.dashboard.referralTitle}
        </h2>
        <p className="text-sm text-zinc-600">
          {dictionary.dashboard.referralSubtitle}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white/80 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralCodeLabel}
          </p>
          <p className="font-heading text-2xl text-blue-900">{stats.code}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralUsageCountLabel}
          </p>
          <p className="text-lg font-semibold text-ink">{stats.usageCount}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white/80 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralLinkLabel}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span className="break-all text-sm font-mono text-ink">
              {stats.shareUrl}
            </span>
            <button
              type="button"
              onClick={copyLink}
              className="rounded-full border border-black/10 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-ink transition hover:border-ink hover:text-ink"
            >
              {copied
                ? dictionary.dashboard.referralCopied
                : dictionary.dashboard.referralLinkAction}
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white/80 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralPointsLabel}
          </p>
          <p className="font-heading text-2xl text-ink">
            {referralPoints.toLocaleString(locale)}
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralRewardLabel} +{" "}
            {dictionary.dashboard.referralRefereeLabel}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralRecentTitle}
          </h3>
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.referralRewardLabel}: {stats.refererReward} /{" "}
            {dictionary.dashboard.referralRefereeLabel}: {stats.refereeReward}
          </span>
        </div>
        {stats.recentUsages.length === 0 ? (
          <p className="text-sm text-zinc-600">
            {dictionary.dashboard.referralUsageEmpty}
          </p>
        ) : (
          <div className="space-y-2">
            {stats.recentUsages.map((usage) => (
              <div
                key={usage.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/70 px-4 py-3 text-sm text-zinc-600"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink">
                  {usage.referredEmail}
                </span>
                <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                  {DATE_FORMATTER(locale).format(usage.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
