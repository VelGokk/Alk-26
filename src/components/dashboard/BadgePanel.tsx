"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppDictionary } from "@/config/i18n";
import { evaluateBadges, type BadgeEvaluation } from "@/config/badges";
import type { LearningPathSummary } from "@/config/learning-paths";
import { t } from "@/lib/i18n";

const OPT_OUT_KEY = "alkayaBadgesHidden";

type BadgePanelProps = {
  dictionary: AppDictionary;
  summary: LearningPathSummary;
};

export function BadgePanel({ dictionary, summary }: BadgePanelProps) {
  const [optOut, setOptOut] = useState(false);
  const evaluation = useMemo(() => evaluateBadges(summary), [summary]);
  const habitBadges = evaluation.filter((badge) => badge.definition.category === "habit");
  const phaseBadges = evaluation.filter(
    (badge) => badge.definition.category === "phase"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(OPT_OUT_KEY);
    setOptOut(stored === "true");
  }, []);

  const toggleOptOut = () => {
    const nextState = !optOut;
    setOptOut(nextState);
    if (typeof window !== "undefined") {
      if (nextState) {
        window.localStorage.setItem(OPT_OUT_KEY, "true");
      } else {
        window.localStorage.removeItem(OPT_OUT_KEY);
      }
    }
  };

  if (optOut) {
    return (
      <div className="space-y-2 rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {dictionary.dashboard.badgesTitle}
            </p>
            <h2 className="text-xl font-heading text-ink">
              {dictionary.dashboard.badgesSubtitle}
            </h2>
          </div>
          <button
            type="button"
            className="rounded-full border border-ink px-3 py-1 text-xs uppercase tracking-[0.3em] text-ink"
            onClick={toggleOptOut}
          >
            {dictionary.dashboard.badgesOptIn}
          </button>
        </div>
        <p className="text-sm text-zinc-600">
          {dictionary.dashboard.badgesOptedOut}
        </p>
      </div>
    );
  }

  function renderBadge(badge: BadgeEvaluation) {
    const label = t(dictionary, badge.definition.labelPath);
    const description = badge.definition.descriptionPath
      ? t(dictionary, badge.definition.descriptionPath)
      : undefined;

    return (
      <article
        key={badge.definition.id}
        className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
              {dictionary.dashboard.badgesLevelLabel}
            </p>
            <p className="text-sm font-semibold text-ink">{badge.level.label}</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">
            {badge.percent}% {dictionary.dashboard.badgesProgressLabel}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-heading text-ink">{label}</h3>
          {description && (
            <p className="mt-2 text-sm text-zinc-500">{description}</p>
          )}
          <div className="mt-4 h-1 rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-ink transition-all duration-500"
              style={{ width: `${badge.percent}%` }}
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-black/10 bg-white/80 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.badgesTitle}
          </p>
          <h2 className="text-2xl font-heading text-ink">
            {dictionary.dashboard.badgesSubtitle}
          </h2>
        </div>
        <button
          type="button"
          onClick={toggleOptOut}
          className="rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-zinc-500 transition hover:border-ink hover:text-ink"
        >
          {dictionary.dashboard.badgesOptOut}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            {dictionary.dashboard.badgesHabitsTitle}
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {habitBadges.map(renderBadge)}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            {dictionary.dashboard.badgesPhasesTitle}
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            {phaseBadges.map(renderBadge)}
          </div>
        </div>
      </div>
    </section>
  );
}
