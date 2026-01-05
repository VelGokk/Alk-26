"use server";

import Link from "next/link";
import type { Translator } from "@/lib/i18n";
import { reportComment, createComment } from "@/lib/actions/comments";
import { Session } from "next-auth";

type LessonComment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name?: string | null;
    email: string | null;
  };
};

type LessonCommentsProps = {
  comments: LessonComment[];
  lessonId: string;
  lessonSlug: string;
  lang: string;
  translate: Translator;
  sessionUser: Session["user"] | null;
};

const REPORT_REASONS = [
  { value: "spam", labelKey: "education.programLessonCommentReportReasonSpam" },
  { value: "abuse", labelKey: "education.programLessonCommentReportReasonAbuse" },
  { value: "other", labelKey: "education.programLessonCommentReportReasonOther" },
] as const;

export default function LessonComments({
  comments,
  lessonId,
  lessonSlug,
  lang,
  translate,
  sessionUser,
}: LessonCommentsProps) {
  const allowReport = Boolean(sessionUser);

  return (
    <section className="glass-panel rounded-3xl border border-black/10 bg-white/90 p-8 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {translate("education.programLessonCommentsLabel")}
          </p>
          <h2 className="font-heading text-2xl text-ink">
            {translate("education.programLessonCommentHeading")}
          </h2>
        </div>
      </div>

      {sessionUser ? (
        <form
          action={createComment}
          className="mt-6 space-y-3"
        >
          <input type="hidden" name="lessonId" value={lessonId} />
          <input type="hidden" name="slug" value={lessonSlug} />
          <input type="hidden" name="lang" value={lang} />
          <textarea
            name="content"
            rows={4}
            required
            placeholder={translate("education.programLessonCommentPlaceholder")}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-ink focus:ring-1 focus:ring-ink"
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.3em] text-white"
          >
            {translate("education.programLessonCommentSubmit")}
          </button>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-white/70 p-4 text-sm text-slate-600">
          {translate("education.programLessonCommentLoginNotice")}{" "}
          <Link
            href={`/${lang}/auth`}
            className="font-semibold text-ink underline"
          >
            {translate("education.programLessonCommentLoginLink")}
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-600">
            {translate("education.programLessonCommentsEmpty")}
          </p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                <span>
                  {comment.user.name ?? comment.user.email ?? "Anonimo"}
                </span>
                <span>{new Date(comment.createdAt).toLocaleString(lang)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{comment.content}</p>

              {allowReport && (
                <form
                  action={reportComment}
                  className="mt-3 flex flex-wrap items-center gap-3"
                >
                  <input type="hidden" name="commentId" value={comment.id} />
                  <select
                    name="reason"
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs"
                  >
                    {REPORT_REASONS.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {translate(reason.labelKey)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
                  >
                    {translate("education.programLessonCommentReportButton")}
                  </button>
                </form>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
