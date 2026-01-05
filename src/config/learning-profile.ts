import type { AppDictionary, AppLocale } from "./i18n";
import { paths } from "./paths";

export type LearningProfileId = "BALANCED" | "DISCOVERER" | "PRACTITIONER" | "SUSTAINER";

export const LEARNING_PROFILE_DEFAULT: LearningProfileId = "BALANCED";

export type DashboardSectionKey = "stats" | "recommendations";

export type LearningRecommendation = {
  id: string;
  titleKey: keyof AppDictionary["dashboard"];
  descriptionKey: keyof AppDictionary["dashboard"];
  actionKey: keyof AppDictionary["dashboard"];
  path: (lang: AppLocale) => string;
};

export type LearningProfileDefinition = {
  id: LearningProfileId;
  labelKey: keyof AppDictionary["learningProfile"];
  dashboardOrder: DashboardSectionKey[];
  recommendations: LearningRecommendation[];
};

const RECOMMENDATIONS: Record<string, LearningRecommendation> = {
  progress: {
    id: "progress",
    titleKey: "dashboard.recommendationProgressTitle",
    descriptionKey: "dashboard.recommendationProgressDescription",
    actionKey: "dashboard.recommendationActionView",
    path: (lang) => `${paths.dashboard.section(lang, "app")}/my-courses`,
  },
  certificates: {
    id: "certificates",
    titleKey: "dashboard.recommendationCertificatesTitle",
    descriptionKey: "dashboard.recommendationCertificatesDescription",
    actionKey: "dashboard.recommendationActionView",
    path: (lang) => `${paths.dashboard.section(lang, "app")}/certificates`,
  },
  programs: {
    id: "programs",
    titleKey: "dashboard.recommendationProgramsTitle",
    descriptionKey: "dashboard.recommendationProgramsDescription",
    actionKey: "dashboard.recommendationActionExplore",
    path: (lang) => paths.public.programs(lang),
  },
  resources: {
    id: "resources",
    titleKey: "dashboard.recommendationResourcesTitle",
    descriptionKey: "dashboard.recommendationResourcesDescription",
    actionKey: "dashboard.recommendationActionExplore",
    path: (lang) => paths.public.recursos(lang),
  },
  notifications: {
    id: "notifications",
    titleKey: "dashboard.recommendationNotificationsTitle",
    descriptionKey: "dashboard.recommendationNotificationsDescription",
    actionKey: "dashboard.recommendationActionView",
    path: (lang) => `${paths.dashboard.section(lang, "app")}/notifications`,
  },
};

const PROFILES: Record<LearningProfileId, LearningProfileDefinition> = {
  BALANCED: {
    id: "BALANCED",
    labelKey: "learningProfile.balanced",
    dashboardOrder: ["stats", "recommendations"],
    recommendations: [
      RECOMMENDATIONS.progress,
      RECOMMENDATIONS.certificates,
      RECOMMENDATIONS.programs,
    ],
  },
  DISCOVERER: {
    id: "DISCOVERER",
    labelKey: "learningProfile.discoverer",
    dashboardOrder: ["recommendations", "stats"],
    recommendations: [
      RECOMMENDATIONS.programs,
      RECOMMENDATIONS.resources,
      RECOMMENDATIONS.progress,
    ],
  },
  PRACTITIONER: {
    id: "PRACTITIONER",
    labelKey: "learningProfile.practitioner",
    dashboardOrder: ["stats", "recommendations"],
    recommendations: [
      RECOMMENDATIONS.progress,
      RECOMMENDATIONS.resources,
      RECOMMENDATIONS.certificates,
    ],
  },
  SUSTAINER: {
    id: "SUSTAINER",
    labelKey: "learningProfile.sustainer",
    dashboardOrder: ["recommendations", "stats"],
    recommendations: [
      RECOMMENDATIONS.certificates,
      RECOMMENDATIONS.notifications,
      RECOMMENDATIONS.resources,
    ],
  },
};

export function getLearningProfile(id?: LearningProfileId) {
  return PROFILES[id ?? LEARNING_PROFILE_DEFAULT];
}

export const LEARNING_PROFILE_IDS = Object.keys(
  PROFILES
) as LearningProfileId[];
