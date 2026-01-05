import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { getDictionary, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import {
  getLearningProfile,
  LEARNING_PROFILE_DEFAULT,
} from "@/config/learning-profile";
import { paths } from "@/config/paths";
import { getProgramProgressSegments } from "@/lib/programs";
import { BadgePanel } from "@/components/dashboard/BadgePanel";
import { UpcomingEventsWidget } from "@/components/dashboard/UpcomingEventsWidget";
import { getUpcomingEventsForUser } from "@/lib/events";
import { ReferralPanel } from "@/components/dashboard/ReferralPanel";
import type {
  SegmentKey,
  LearningPathSummary,
} from "@/config/learning-paths";
import { getUserReferralStats } from "@/lib/referrals";

export default async function StudentDashboard({
  params,
}: {
  params: { lang: string };
}) {
  await requireRole([Role.USER, Role.SUBSCRIBER, Role.SUPERADMIN]);
  const session = await getServerSession(authOptions);
  const resolvedLang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(resolvedLang);
  const profileId =
    session?.user.learningProfile ?? LEARNING_PROFILE_DEFAULT;
  const SEGMENT_KEYS: SegmentKey[] = [
    "observacion",
    "orden",
    "accion",
    "sostenimiento",
  ];
  const defaultSummary: LearningPathSummary = {
    segments: SEGMENT_KEYS.map((key) => ({ key, percent: 0 })),
    overallPercent: 0,
  };
  const enrollment = session?.user?.id
    ? await prisma.enrollment.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { program: true },
      })
    : null;
  const summary = enrollment
    ? await getProgramProgressSegments(enrollment.programId, session.user.id)
    : defaultSummary;
  const profile = getLearningProfile(profileId);

  const [enrollments, payments] = await Promise.all([
    prisma.enrollment.count({ where: { userId: session?.user.id } }),
    prisma.payment.count({ where: { userId: session?.user.id } }),
  ]);

  const referralStats =
    session?.user?.id && session.user.referralPoints !== undefined
      ? await getUserReferralStats(session.user.id, resolvedLang)
      : null;

  const statsSection = (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.learningProfileLabel}
          </p>
          <p className="font-heading text-2xl text-ink">
            {dictionary.learningProfile[profile.labelKey]}
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {dictionary.dashboard.learningProfileSubtitle}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            {dictionary.dashboard.activeCourses ?? "Cursos activos"}
          </p>
          <p className="mt-2 text-2xl font-heading">{enrollments}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            {dictionary.dashboard.payments ?? "Pagos registrados"}
          </p>
          <p className="mt-2 text-2xl font-heading">{payments}</p>
        </div>
      </div>
    </div>
  );

  const recommendationsSection = (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-xl font-heading">{dictionary.dashboard.recommendationsTitle}</h2>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {dictionary.dashboard.recommendationsSubtitle}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {profile.recommendations.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm"
          >
            <h3 className="font-semibold text-lg text-ink">
              {dictionary.dashboard[item.titleKey]}
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              {dictionary.dashboard[item.descriptionKey]}
            </p>
            <div className="mt-6">
              <Link
                href={item.path(resolvedLang)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ink transition hover:text-ink/70"
              >
                {dictionary.dashboard[item.actionKey]}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const upcomingEvents =
    session?.user?.id && session.user.roles
      ? await getUpcomingEventsForUser(session.user.id, resolvedLang)
      : [];

  const sectionMapping = {
    stats: statsSection,
    recommendations: recommendationsSection,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Alumno
        </p>
        <h1 className="font-heading text-3xl">Mi progreso</h1>
      </div>
      {!session?.user.learningPath && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-3">
          <p className="text-sm text-zinc-600">
            {dictionary.dashboard.onboardingPrompt}
          </p>
          <Link
            href={`${paths.dashboard.section(resolvedLang, "app")}/onboarding`}
            className="rounded-full border border-ink px-4 py-2 text-xs uppercase tracking-[0.3em] text-ink transition hover:border-ink/60"
          >
            {dictionary.dashboard.onboardingCTA}
          </Link>
        </div>
      )}
      <BadgePanel dictionary={dictionary} summary={summary} />
      {referralStats && (
        <ReferralPanel
          dictionary={dictionary}
          stats={referralStats}
          referralPoints={session?.user?.referralPoints ?? 0}
          locale={resolvedLang}
        />
      )}
      <UpcomingEventsWidget
        dictionary={dictionary}
        events={upcomingEvents}
        locale={resolvedLang}
      />
      {profile.dashboardOrder.map((section) => (
        <div key={section}>{sectionMapping[section]}</div>
      ))}
    </div>
  );
}
