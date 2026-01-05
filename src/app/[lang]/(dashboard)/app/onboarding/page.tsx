import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import {
  DEFAULT_LOCALE,
  AppDictionary,
  getDictionary,
  isLocale,
} from "@/config/i18n";
import { LEARNING_PROFILE_DEFAULT } from "@/config/learning-profile";
import { OnboardingChat, type OnboardingSessionState } from "@/components/onboarding/OnboardingChat";

export default async function OnboardingPage({
  params,
}: {
  params: { lang: string };
}) {
  const session = await requireRole([Role.USER, Role.SUBSCRIBER, Role.SUPERADMIN]);
  const resolvedLang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const dictionary: AppDictionary = await getDictionary(resolvedLang);
  const onboarding = await prisma.onboardingSession.findUnique({
    where: { userId: session.user.id },
  });

  const initialState: OnboardingSessionState = {
    step: onboarding?.step ?? (session.user.learningPath ? 3 : 1),
    learningProfile:
      onboarding?.learningProfile ??
      session.user.learningProfile ??
      LEARNING_PROFILE_DEFAULT,
    learningPath: onboarding?.learningPath ?? session.user.learningPath ?? null,
    isComplete:
      onboarding?.isComplete ??
      Boolean(onboarding?.learningPath ?? session.user.learningPath),
    answers: (onboarding?.answers as Record<string, string>) ?? {},
  };

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 md:px-0">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {dictionary.dashboard.onboardingTitle}
        </p>
        <h1 className="font-heading text-3xl text-ink">
          {dictionary.dashboard.onboardingSubtitle}
        </h1>
        <p className="text-sm text-zinc-600">
          {dictionary.dashboard.onboardingPageHelper}
        </p>
      </div>
      <div className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
        <OnboardingChat dictionary={dictionary} initialState={initialState} />
      </div>
    </div>
  );
}
