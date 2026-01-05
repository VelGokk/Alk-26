"use server";

import { prisma } from "@/lib/prisma";
import { resolveReport } from "@/lib/actions/moderator";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import {
  createTranslator,
  getDictionary,
  isLocale,
  DEFAULT_LOCALE,
} from "@/lib/i18n";

type ModeratorReportPageProps = {
  params: { lang: string };
};

export default async function ModeratorReportsPage({
  params,
}: ModeratorReportPageProps) {
  const lang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(lang);
  const translate = createTranslator(dictionary);

  await requireRole([Role.MODERATOR, Role.SUPERADMIN]);
  const reports = await prisma.moderationReport.findMany({
    where: { status: { in: ["OPEN", "IN_REVIEW"] } },
    orderBy: { createdAt: "desc" },
    include: {
      comment: {
        include: {
          user: true,
          lesson: {
            include: {
              module: {
                include: {
                  program: true,
                },
              },
            },
          },
          resource: {
            include: {
              lesson: {
                include: {
                  module: {
                    include: {
                      program: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      actions: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {translate("dashboard.moderatorReportsTitle")}
        </p>
        <h1 className="font-heading text-3xl">
          {translate("dashboard.moderatorReportsSubtitle")}
        </h1>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
          {translate("dashboard.moderatorReportsEmpty")}
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const comment = report.comment;
            const programTitle =
              comment?.lesson?.module?.program?.title ??
              comment?.resource?.lesson?.module?.program?.title;
            const userLabel = comment?.user?.name ?? comment?.user?.email;
            const targetPhase =
              comment?.lesson?.module?.phase ??
              comment?.resource?.lesson?.module?.phase;

            return (
              <div
                key={report.id}
                className="glass-panel rounded-2xl p-4 space-y-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      {translate("dashboard.moderatorReportTarget")}
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    {report.reason}
                  </p>
                  {comment ? (
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>
                        {translate("dashboard.moderatorReportCommentBy")}{" "}
                        <span className="font-semibold text-slate-800">
                          {userLabel ?? "Anonimo"}
                        </span>
                      </p>
                      <p className="line-clamp-3">{comment.content}</p>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                        {translate("dashboard.moderatorReportProgramLabel")}{" "}
                        {programTitle ?? "Programa"}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                        {translate("dashboard.moderatorReportPhaseLabel")}{" "}
                        {targetPhase ?? "Sin fase"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      {translate("dashboard.moderatorReportNoComment")}
                    </p>
                  )}
                </div>

                <form action={resolveReport} className="space-y-3">
                  <input type="hidden" name="reportId" value={report.id} />
                  <div className="grid gap-2 md:grid-cols-4">
                    <select
                      name="actionType"
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                    >
                      <option value="HIDE">
                        {translate("dashboard.moderatorReportActionHide")}
                      </option>
                      <option value="DELETE">
                        {translate("dashboard.moderatorReportActionDelete")}
                      </option>
                      <option value="BAN">
                        {translate("dashboard.moderatorReportActionBan")}
                      </option>
                      <option value="WARN">
                        {translate("dashboard.moderatorReportActionWarn")}
                      </option>
                      <option value="RESOLVE">
                        {translate("dashboard.moderatorReportActionResolve")}
                      </option>
                    </select>
                    <input
                      type="number"
                      name="banMinutes"
                      placeholder={translate("dashboard.moderatorReportBanMinutes")}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                    />
                    <input
                      name="note"
                      placeholder={translate("dashboard.moderatorReportNotePlaceholder")}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-ink px-3 py-2 text-xs uppercase tracking-[0.2em] text-white"
                    >
                      {translate("dashboard.moderatorReportActionConfirm")}
                    </button>
                  </div>
                </form>

                {report.actions.length > 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-[11px] uppercase tracking-[0.3em] text-slate-600">
                    <p className="text-[11px] font-semibold text-slate-600">
                      {translate("dashboard.moderatorReportHistory")}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {report.actions.map((action) => (
                        <li
                          key={action.id}
                          className="flex flex-col gap-1 leading-tight"
                        >
                          <span className="text-[10px] tracking-[0.3em] text-slate-500">
                            {action.actionType}
                          </span>
                          <span className="text-sm text-slate-700">
                            {action.note ?? translate("dashboard.moderatorReportHistoryEmpty")}
                          </span>
                          <span className="text-[10px] tracking-[0.3em] text-slate-500">
                            {new Date(action.createdAt).toLocaleString(lang)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
