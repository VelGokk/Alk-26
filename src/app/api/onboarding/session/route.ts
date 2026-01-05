import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  LEARNING_PROFILE_IDS,
  LearningProfileId,
} from "@/config/learning-profile";
import {
  LEARNING_PATH_IDS,
  LearningPathId,
} from "@/config/learning-paths";

type OnboardingAction = "profile" | "path";

type OnboardingRequest = {
  action: OnboardingAction;
  value: string;
};

function parseAnswers(answers: unknown): Record<string, string> {
  if (typeof answers === "object" && answers !== null) {
    return answers as Record<string, string>;
  }
  return {};
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: OnboardingRequest;
  try {
    body = (await request.json()) as OnboardingRequest;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { action, value } = body ?? {};
  if (!action || !value) {
    return NextResponse.json({ error: "Missing action or value" }, { status: 400 });
  }

  if (action !== "profile" && action !== "path") {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  const userId = session.user.id;
  const existingSession = await prisma.onboardingSession.findUnique({
    where: { userId },
  });

  const existingAnswers = parseAnswers(existingSession?.answers);
  const isProfileAction = action === "profile";
  const isPathAction = action === "path";

  if (
    isProfileAction &&
    !LEARNING_PROFILE_IDS.includes(value as LearningProfileId)
  ) {
    return NextResponse.json({ error: "Unknown profile" }, { status: 400 });
  }

  if (isPathAction && !LEARNING_PATH_IDS.includes(value as LearningPathId)) {
    return NextResponse.json({ error: "Unknown path" }, { status: 400 });
  }

  const fallbackProfile =
    existingSession?.learningProfile ??
    (session.user.learningProfile as LearningProfileId) ??
    (LEARNING_PROFILE_IDS[0] as LearningProfileId);
  const profileValue = isProfileAction
    ? (value as LearningProfileId)
    : fallbackProfile;

  const pathForUpdate =
    isPathAction
      ? (value as LearningPathId)
      : existingSession?.learningPath ?? null;

  const mergedAnswers = {
    ...existingAnswers,
    ...(isProfileAction ? { profile: value } : {}),
    ...(isPathAction ? { path: value } : {}),
  };

  const updatedSession = await prisma.onboardingSession.upsert({
    where: { userId },
    create: {
      userId,
      step: isProfileAction ? 2 : 3,
      learningProfile: profileValue,
      learningPath: pathForUpdate,
      isComplete: isPathAction,
      answers: mergedAnswers,
    },
    update: {
      step: isProfileAction ? 2 : 3,
      learningProfile: profileValue,
      learningPath: pathForUpdate,
      isComplete: isPathAction,
      answers: mergedAnswers,
    },
  });

  if (isProfileAction) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        learningProfile: profileValue,
      },
    });
  }

  if (isPathAction && pathForUpdate) {
    await prisma.learningPathAssignment.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
    await prisma.learningPathAssignment.create({
      data: {
        userId,
        path: pathForUpdate,
        isActive: true,
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: {
        learningProfile: profileValue,
        learningPath: pathForUpdate,
      },
    });
  }

  return NextResponse.json({
    success: true,
    onboarding: {
      step: updatedSession.step,
      learningProfile: updatedSession.learningProfile,
      learningPath: updatedSession.learningPath,
      isComplete: updatedSession.isComplete,
      answers: updatedSession.answers,
    },
  });
}
