import type { AppDictionary, AppLocale } from "./i18n";
import { paths } from "./paths";
import type { LearningPathSummary, SegmentKey } from "./learning-paths";

export type RecommendationInfo = {
  id: string;
  title: string;
  description: string;
  reason: string;
  path: string;
  priority: number;
};

type RecommendationDefinition = {
  id: string;
  titleKey: keyof AppDictionary["dashboard"];
  descriptionKey: keyof AppDictionary["dashboard"];
  reasonKey: keyof AppDictionary["dashboard"];
  segmentKeys: SegmentKey[];
  path: (lang: AppLocale) => string;
};

const RECOMMENDATION_DEFINITIONS: RecommendationDefinition[] = [
  {
    id: "observation",
    titleKey: "recommendationProgressTitle",
    descriptionKey: "recommendationProgressDescription",
    reasonKey: "recommendationWhyObservation",
    segmentKeys: ["observacion"],
    path: (lang) => `${paths.dashboard.section(lang, "app")}/my-courses`,
  },
  {
    id: "order",
    titleKey: "recommendationProgramsTitle",
    descriptionKey: "recommendationProgramsDescription",
    reasonKey: "recommendationWhyOrder",
    segmentKeys: ["orden", "accion"],
    path: (lang) => paths.public.programs(lang),
  },
  {
    id: "sustainment",
    titleKey: "recommendationResourcesTitle",
    descriptionKey: "recommendationResourcesDescription",
    reasonKey: "recommendationWhySustainment",
    segmentKeys: ["sostenimiento"],
    path: (lang) => paths.public.recursos(lang),
  },
];

function getSegmentPercent(
  summary: LearningPathSummary,
  key: SegmentKey
): number {
  return (
    summary.segments.find((segment) => segment.key === key)?.percent ?? 0
  );
}

function formatReason(template: string, percent: number) {
  return template.replace("{percent}", `${Math.round(percent)}%`);
}

export function getRecommendationSuggestions(
  summary: LearningPathSummary,
  dictionary: AppDictionary,
  lang: AppLocale
): RecommendationInfo[] {
  return RECOMMENDATION_DEFINITIONS.map((definition) => {
    const percent =
      definition.segmentKeys.reduce((sum, key) => sum + getSegmentPercent(summary, key), 0) /
      Math.max(definition.segmentKeys.length, 1);

    const reasonTemplate = dictionary.dashboard[definition.reasonKey];

    return {
      id: definition.id,
      title: dictionary.dashboard[definition.titleKey],
      description: dictionary.dashboard[definition.descriptionKey],
      reason: formatReason(reasonTemplate, percent),
      path: definition.path(lang),
      priority: percent,
    };
  })
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);
}
