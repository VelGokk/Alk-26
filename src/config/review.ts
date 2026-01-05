import type { ContentReviewState } from "@prisma/client";

export type ReviewChecklistItem = {
  id: string;
  labelKey: string;
  helperKey?: string;
};

export const REVIEW_CHECKLIST: ReviewChecklistItem[] = [
  {
    id: "structure",
    labelKey: "dashboard.reviewChecklistStructure",
    helperKey: "dashboard.reviewChecklistStructureHelp",
  },
  {
    id: "clarity",
    labelKey: "dashboard.reviewChecklistClarity",
    helperKey: "dashboard.reviewChecklistClarityHelp",
  },
  {
    id: "practice",
    labelKey: "dashboard.reviewChecklistPractice",
    helperKey: "dashboard.reviewChecklistPracticeHelp",
  },
];

export type ReviewChecklistState = Record<
  (typeof REVIEW_CHECKLIST)[number]["id"],
  boolean
>;

export const REVIEW_STATUSES: {
  id: ContentReviewState;
  labelKey: string;
}[] = [
  { id: "PENDING", labelKey: "dashboard.reviewStatusPending" },
  { id: "IN_REVIEW", labelKey: "dashboard.reviewStatusInReview" },
  { id: "CHANGES_REQUESTED", labelKey: "dashboard.reviewStatusChangesRequested" },
  { id: "APPROVED", labelKey: "dashboard.reviewStatusApproved" },
  { id: "PUBLISHED", labelKey: "dashboard.reviewStatusPublished" },
];

export const REVIEW_STATUS_FLOW = REVIEW_STATUSES.map((status) => status.id);

export const REVIEW_TRANSITIONS: Record<ContentReviewState, ContentReviewState[]> = {
  PENDING: ["IN_REVIEW"],
  IN_REVIEW: ["CHANGES_REQUESTED", "APPROVED"],
  CHANGES_REQUESTED: ["IN_REVIEW"],
  APPROVED: ["PUBLISHED"],
  PUBLISHED: [],
};
