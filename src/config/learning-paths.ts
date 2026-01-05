import type { AppDictionary, AppLocale } from "./i18n";
import { paths } from "./paths";

export type SegmentKey = "observacion" | "orden" | "accion" | "sostenimiento";

export type LearningPathId = "FOUNDATION" | "ACTION" | "SUSTAINMENT" | "EXPEDITION";

export const LEARNING_PATH_DEFAULT: LearningPathId = "FOUNDATION";

export type LearningRecommendation = {
  id: string;
  titleKey: keyof AppDictionary["dashboard"];
  descriptionKey: keyof AppDictionary["dashboard"];
  actionKey: keyof AppDictionary["dashboard"];
  path: (lang: AppLocale) => string;
};

export type LearningPathDefinition = {
  id: LearningPathId;
  labelKey: keyof AppDictionary["dashboard"];
  descriptionKey: keyof AppDictionary["dashboard"];
  phaseRequirements: Partial<Record<SegmentKey, number>>;
  recommendation: LearningRecommendation;
};

export type LearningPathSummary = {
  segments: { key: SegmentKey; percent: number }[];
  overallPercent: number;
};

export type LearningPathStatus = "locked" | "unlocked" | "complete";

export type LearningPathEvaluation = {
  definition: LearningPathDefinition;
  status: LearningPathStatus;
  completionRatio: number;
};

const PATHS: Record<LearningPathId, LearningPathDefinition> = {
  FOUNDATION: {
    id: "FOUNDATION",
    labelKey: "learningPathFoundation",
    descriptionKey: "learningPathFoundationDescription",
    phaseRequirements: { observacion: 50 },
    recommendation: {
      id: "foundation",
      titleKey: "recommendationProgressTitle",
      descriptionKey: "recommendationProgressDescription",
      actionKey: "recommendationActionView",
      path: (lang) => `${paths.dashboard.section(lang, "app")}/my-courses`,
    },
  },
  ACTION: {
    id: "ACTION",
    labelKey: "learningPathAction",
    descriptionKey: "learningPathActionDescription",
    phaseRequirements: { orden: 60, accion: 60 },
    recommendation: {
      id: "action",
      titleKey: "recommendationProgramsTitle",
      descriptionKey: "recommendationProgramsDescription",
      actionKey: "recommendationActionExplore",
      path: (lang) => paths.public.programs(lang),
    },
  },
  SUSTAINMENT: {
    id: "SUSTAINMENT",
    labelKey: "learningPathSustainer",
    descriptionKey: "learningPathSustainerDescription",
    phaseRequirements: { sostenimiento: 50 },
    recommendation: {
      id: "sustain",
      titleKey: "recommendationResourcesTitle",
      descriptionKey: "recommendationResourcesDescription",
      actionKey: "recommendationActionExplore",
      path: (lang) => paths.public.recursos(lang),
    },
  },
  EXPEDITION: {
    id: "EXPEDITION",
    labelKey: "learningPathExpedition",
    descriptionKey: "learningPathExpeditionDescription",
    phaseRequirements: { observacion: 75, orden: 75, accion: 75, sostenimiento: 75 },
    recommendation: {
      id: "expedition",
      titleKey: "recommendationCertificatesTitle",
      descriptionKey: "recommendationCertificatesDescription",
      actionKey: "recommendationActionView",
      path: (lang) => `${paths.dashboard.section(lang, "app")}/certificates`,
    },
  },
};

export const LEARNING_PATH_DEFINITIONS: Record<
  LearningPathId,
  LearningPathDefinition
> = PATHS;

export const LEARNING_PATH_IDS = Object.keys(PATHS) as LearningPathId[];

function getSegmentPercent(
  summary: LearningPathSummary,
  key: SegmentKey
): number {
  return (
    summary.segments.find((segment) => segment.key === key)?.percent ?? 0
  );
}

export function evaluateLearningPaths(
  summary: LearningPathSummary
): LearningPathEvaluation[] {
  return Object.values(PATHS).map((definition) => {
    const requirementEntries = Object.entries(definition.phaseRequirements);
    const ratios =
      requirementEntries.length === 0
        ? [summary.overallPercent / 100]
        : requirementEntries.map(([phaseKey, threshold]) => {
            const actual = getSegmentPercent(
              summary,
              phaseKey as SegmentKey
            );
            return threshold > 0 ? actual / threshold : 0;
          });

    const completionRatio = Math.min(
      1,
      ratios.reduce((sum, value) => sum + value, 0) /
        Math.max(ratios.length, 1)
    );

    const meetsRequirements = ratios.every((ratio) => ratio >= 1);
    const status: LearningPathStatus = meetsRequirements
      ? summary.overallPercent >= 100
        ? "complete"
        : "unlocked"
      : "locked";

    return {
      definition,
      status,
      completionRatio,
    };
  });
}
