import type { AppDictionary } from "./i18n";
import type {
  LearningPathSummary,
  SegmentKey,
} from "./learning-paths";
import type { TranslatorPath } from "./i18n";

export type BadgeCategory = "phase" | "habit";

export type BadgeLevel = {
  label: string;
  threshold: number;
};

export const ALKAYA_BADGE_LEVELS: BadgeLevel[] = [
  { label: "Alkaya Ember", threshold: 0 },
  { label: "Alkaya Bloom", threshold: 25 },
  { label: "Alkaya Flow", threshold: 50 },
  { label: "Alkaya Summit", threshold: 75 },
  { label: "Alkaya Legacy", threshold: 95 },
];

type BadgeDefinition = {
  id: string;
  category: BadgeCategory;
  segmentKeys: SegmentKey[];
  labelPath: TranslatorPath<AppDictionary>;
  descriptionPath?: TranslatorPath<AppDictionary>;
};

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "observacion",
    category: "phase",
    segmentKeys: ["observacion"],
    labelPath: "education.programPhaseDISCOVERY",
    descriptionPath: "dashboard.badgesPhasePresence",
  },
  {
    id: "orden",
    category: "phase",
    segmentKeys: ["orden"],
    labelPath: "education.programPhaseORDEN",
    descriptionPath: "dashboard.badgesPhaseStructure",
  },
  {
    id: "accion",
    category: "phase",
    segmentKeys: ["accion"],
    labelPath: "education.programPhaseACCION",
    descriptionPath: "dashboard.badgesPhaseAction",
  },
  {
    id: "sostenimiento",
    category: "phase",
    segmentKeys: ["sostenimiento"],
    labelPath: "education.programPhaseSUSTAINMENT",
    descriptionPath: "dashboard.badgesPhaseSustain",
  },
  {
    id: "presence",
    category: "habit",
    segmentKeys: ["observacion", "orden"],
    labelPath: "dashboard.badgesHabitPresence",
    descriptionPath: "dashboard.badgesHabitPresenceDescription",
  },
  {
    id: "momentum",
    category: "habit",
    segmentKeys: ["accion"],
    labelPath: "dashboard.badgesHabitMomentum",
    descriptionPath: "dashboard.badgesHabitMomentumDescription",
  },
  {
    id: "sustainment",
    category: "habit",
    segmentKeys: ["sostenimiento"],
    labelPath: "dashboard.badgesHabitSustainment",
    descriptionPath: "dashboard.badgesHabitSustainmentDescription",
  },
];

export type BadgeEvaluation = {
  definition: BadgeDefinition;
  percent: number;
  level: BadgeLevel;
};

function getSegmentPercent(
  summary: LearningPathSummary,
  key: SegmentKey
): number {
  return (
    summary.segments.find((segment) => segment.key === key)?.percent ?? 0
  );
}

function getAverageProgress(
  summary: LearningPathSummary,
  keys: SegmentKey[]
) {
  if (keys.length === 0) return 0;
  const total = keys.reduce(
    (acc, key) => acc + getSegmentPercent(summary, key),
    0
  );
  return total / keys.length;
}

function resolveLevel(percent: number): BadgeLevel {
  return (
    ALKAYA_BADGE_LEVELS.slice()
      .reverse()
      .find((level) => percent >= level.threshold) ?? ALKAYA_BADGE_LEVELS[0]
  );
}

export function evaluateBadges(
  summary: LearningPathSummary
): BadgeEvaluation[] {
  return BADGE_DEFINITIONS.map((definition) => {
    const percent = Math.round(getAverageProgress(summary, definition.segmentKeys));
    return {
      definition,
      percent,
      level: resolveLevel(percent),
    };
  });
}
