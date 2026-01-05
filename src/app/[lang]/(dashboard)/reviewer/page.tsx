import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role, type ContentReviewState } from "@prisma/client";
import { createTranslator, getDictionary, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import {
  REVIEW_CHECKLIST,
  REVIEW_STATUSES,
  REVIEW_STATUS_FLOW,
  REVIEW_TRANSITIONS,
} from "@/config/review";
import { addReviewFeedback, transitionContentReview } from "@/lib/actions/contentReview";
import { paths } from "@/config/paths";

const REVIEW_ACTIONS: { status: ContentReviewState; labelKey: string }[] = [
  { status: "IN_REVIEW", labelKey: "dashboard.reviewActionStart" },
  { status: "CHANGES_REQUESTED", labelKey: "dashboard.reviewActionChanges" },
  { status: "APPROVED", labelKey: "dashboard.reviewActionApprove" },
  { status: "PUBLISHED", labelKey: "dashboard.reviewActionPublish" },
];

export default async function ReviewerDashboard({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams?: { reviewId?: string };
}) {
  await requireRole([Role.REVIEWER, Role.SUPERADMIN]);
  const resolvedLang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(resolvedLang);
  const translate = createTranslator(dictionary);
  const basePath = paths.dashboard.section(resolvedLang, "reviewer");

  const reviews = await prisma.contentReview.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
      instructor: true,
      reviewer: true,
      feedback: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
      decisions: {
        orderBy: { createdAt: "desc" },
        include: { createdBy: true },
      },
    },
  });

  const selectedId =
    typeof searchParams?.reviewId === "string" ? searchParams.reviewId : undefined;
  const selectedReview =
    reviews.find((review) => review.id === selectedId) ?? reviews[0] ?? null;

  const statusBuckets = REVIEW_STATUS_FLOW.map((status) => ({
    status,
    items: reviews.filter((review) => review.status === status),
  }));

  const getStatusLabel = (status: ContentReviewState) => {
    const entry = REVIEW_STATUSES.find((item) => item.id === status);
    return entry ? translate(entry.labelKey) : status;
  };

  const checklistState =
    (selectedReview?.checklist as Record<string, boolean> | undefined) ?? {};

  const allowedTransitions = new Set(
    selectedReview ? REVIEW_TRANSITIONS[selectedReview.status] ?? [] : []
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {translate("dashboard.reviewerRoot")}
          </p>
          <h1 className="font-heading text-3xl">
            {translate("dashboard.reviewPipelineTitle") ?? "Review pipeline"}
          </h1>
          <p className="text-sm text-zinc-500">
            {translate("dashboard.reviewPipelineSubtitle")}
          </p>
        </div>

        {statusBuckets.map((bucket) => (
          <div key={bucket.status} className="space-y-3 rounded-2xl border border-black/5 p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-zinc-500">
              <span>{getStatusLabel(bucket.status)}</span>
              <span>{bucket.items.length}</span>
            </div>
            <div className="space-y-2">
              {bucket.items.length === 0 ? (
                <p className="text-[11px] text-zinc-400">
                  {translate("dashboard.reviewBucketEmpty")}
                </p>
              ) : (
                bucket.items.map((review) => {
                  const isActive = selectedReview?.id === review.id;
                  return (
                    <Link
                      key={review.id}
                      href={`${basePath}?reviewId=${review.id}`}
                      className={`block rounded-xl border px-3 py-2 text-sm transition ${
                        isActive
                          ? "border-ink bg-ink/5 text-ink"
                          : "border-transparent hover:border-black/10"
                      }`}
                    >
                      <p className="font-semibold">{review.lesson.title}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                        {review.lesson.module.course.title}
                      </p>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </aside>

      <section className="space-y-6">
        {!selectedReview ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
            {translate("dashboard.reviewBucketEmpty")}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-black/10 p-6 space-y-3">
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                  {translate("dashboard.reviewLessonLabel")}
                </p>
                <h2 className="font-heading text-2xl">{selectedReview.lesson.title}</h2>
                <p className="text-sm text-zinc-500">
                  {selectedReview.lesson.module.title}
                </p>
                <p className="text-sm text-zinc-500">
                  {translate("dashboard.reviewCourseLabel")}:{" "}
                  {selectedReview.lesson.module.course.title}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-ink/30 px-3 py-1 text-[11px] uppercase tracking-[0.4em] text-ink">
                {getStatusLabel(selectedReview.status)}
              </span>
              {selectedReview.summary && (
                <p className="text-sm text-zinc-600">
                  <span className="font-semibold">
                    {translate("dashboard.reviewSummaryLabel")}:{" "}
                  </span>
                  {selectedReview.summary}
                </p>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-4 rounded-2xl border border-black/10 p-6">
                <h3 className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {translate("dashboard.reviewChecklistLabel")}
                </h3>
                <p className="text-xs text-zinc-500">{translate("dashboard.reviewChecklistHint")}</p>
                <form action={transitionContentReview} className="space-y-4">
                  <input type="hidden" name="reviewId" value={selectedReview.id} />
                  <textarea
                    name="notes"
                    defaultValue={selectedReview.summary ?? ""}
                    placeholder={translate("dashboard.reviewNotesLabel")}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                  />
                  <div className="space-y-3">
                    {REVIEW_CHECKLIST.map((item) => (
                      <label
                        key={item.id}
                        className="flex flex-col gap-1 rounded-2xl border border-black/10 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name={`checklist.${item.id}`}
                            defaultChecked={Boolean(checklistState[item.id])}
                            className="h-4 w-4 rounded border-black/20 text-ink focus:ring-ink"
                          />
                          <span className="font-semibold">{translate(item.labelKey)}</span>
                        </div>
                        {item.helperKey && (
                          <p className="text-[13px] text-zinc-500">
                            {translate(item.helperKey)}
                          </p>
                        )}
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {REVIEW_ACTIONS.map((action) => {
                      const disabled = !allowedTransitions.has(action.status);
                      return (
                        <button
                          key={action.status}
                          type="submit"
                          name="status"
                          value={action.status}
                          disabled={disabled}
                          className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                            disabled
                              ? "border border-black/10 bg-zinc-200 text-zinc-500"
                              : "border border-ink bg-ink text-white"
                          }`}
                        >
                          {translate(action.labelKey)}
                        </button>
                      );
                    })}
                  </div>
                </form>
              </div>

              <div className="space-y-4 rounded-2xl border border-black/10 p-6">
                <h3 className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {translate("dashboard.reviewFeedbackLabel")}
                </h3>
                <form action={addReviewFeedback} className="space-y-3">
                  <input type="hidden" name="reviewId" value={selectedReview.id} />
                  <input
                    name="anchor"
                    placeholder={translate("dashboard.reviewAnchorLabel")}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
                  />
                  <textarea
                    name="message"
                    placeholder={translate("dashboard.reviewFeedbackPlaceholder")}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.3em] text-white"
                  >
                    {translate("dashboard.reviewFeedbackAdd")}
                  </button>
                </form>
                <div className="space-y-3">
                  {selectedReview.feedback.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      No hay feedback anclado aún.
                    </p>
                  ) : (
                    selectedReview.feedback.map((entry) => (
                      <div key={entry.id} className="rounded-xl border border-black/5 p-3 text-sm">
                        <p className="font-semibold">{entry.message}</p>
                        <p className="text-[11px] text-zinc-500">
                          {entry.anchor && (
                            <>
                              {translate("dashboard.reviewAnchorLabel")}: {entry.anchor} ·{" "}
                            </>
                          )}
                          {entry.author?.name ?? "Reviewer"} ·{" "}
                          {new Date(entry.createdAt).toLocaleString(resolvedLang)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-black/10 p-6">
              <h3 className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Historial
              </h3>
              {selectedReview.decisions.length === 0 ? (
                <p className="text-sm text-zinc-500">Aún no hay decisiones registradas.</p>
              ) : (
                <div className="space-y-3">
                  {selectedReview.decisions.map((decision) => (
                    <div key={decision.id} className="rounded-xl border border-black/5 p-3 text-sm">
                      <p className="font-semibold">
                        {getStatusLabel(decision.state)} ·{" "}
                        {decision.createdBy?.name ?? "Reviewer"}
                      </p>
                      {decision.notes && (
                        <p className="text-zinc-600">{decision.notes}</p>
                      )}
                      <p className="text-[11px] text-zinc-500">
                        {new Date(decision.createdAt).toLocaleString(resolvedLang)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
