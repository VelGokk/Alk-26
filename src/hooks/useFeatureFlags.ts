import { useMemo } from "react";
import { getFeatureFlags, type PlatformFeatureFlags } from "@/config/feature-flags";

export function useFeatureFlags(): PlatformFeatureFlags {
  return useMemo(() => getFeatureFlags(), []);
}
