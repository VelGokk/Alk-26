import { prisma } from "@/lib/prisma";

export async function getFlowReadiness(userId?: string) {
  if (!userId) return false;
  const [onboarding, lessonProgress] = await Promise.all([
    prisma.onboardingSession.findUnique({
      where: { userId },
      select: { isComplete: true },
    }),
    prisma.lessonProgress.findFirst({
      where: {
        enrollment: { userId },
        completed: true,
      },
    }),
  ]);
  if (onboarding?.isComplete) return true;
  if (lessonProgress) return true;
  const programProgress = await prisma.programProgress.findFirst({
    where: {
      enrollment: { userId },
      completed: true,
    },
  });
  return Boolean(programProgress);
}
