export type FeatureFlagKey =
  | "motionEnabled"
  | "cursorDotEnabled"
  | "flowGlowEnabled"
  | "multiTenantEnabled"
  | "insightsFeedEnabled"
  | "legalEditor"
  | "feedInsights"
  | "splitQA";

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

const DEFAULT_FLAGS: FeatureFlags = {
  motionEnabled: false,
  cursorDotEnabled: false,
  flowGlowEnabled: false,
  multiTenantEnabled: false,
  insightsFeedEnabled: false,
  legalEditor: false,
  feedInsights: false,
  splitQA: false,
};

function resolveFlag(key: FeatureFlagKey, envKey?: string): boolean {
  const raw =
    process.env[envKey ?? `NEXT_PUBLIC_FLAG_${key.toUpperCase()}`] ?? "";
  if (raw === "") return DEFAULT_FLAGS[key];
  return raw === "true";
}

export function getFeatureFlags(overrides?: Partial<FeatureFlags>): FeatureFlags {
  const envFlags: FeatureFlags = {
    motionEnabled: resolveFlag("motionEnabled", "NEXT_PUBLIC_FLAG_MOTION"),
    cursorDotEnabled: resolveFlag("cursorDotEnabled", "NEXT_PUBLIC_FLAG_CURSOR_DOT"),
    flowGlowEnabled: resolveFlag("flowGlowEnabled", "NEXT_PUBLIC_FLAG_FLOW_GLOW"),
    multiTenantEnabled: resolveFlag(
      "multiTenantEnabled",
      "NEXT_PUBLIC_FLAG_MULTI_TENANT"
    ),
    insightsFeedEnabled: resolveFlag(
      "insightsFeedEnabled",
      "NEXT_PUBLIC_FLAG_INSIGHTS_FEED"
    ),
    legalEditor: resolveFlag("legalEditor", "NEXT_PUBLIC_FLAG_LEGAL_EDITOR"),
    feedInsights: resolveFlag("feedInsights", "NEXT_PUBLIC_FLAG_FEED_INSIGHTS"),
    splitQA: resolveFlag("splitQA", "NEXT_PUBLIC_FLAG_SPLIT_QA"),
  };

  return { ...DEFAULT_FLAGS, ...envFlags, ...overrides };
}
