import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { paths } from "@/lib/paths";
import { DEFAULT_LOCALE } from "@/config/i18n";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const lessonId = typeof body?.lessonId === "string" ? body.lessonId : "";
  if (!lessonId) {
    return NextResponse.json({ error: "missing_lesson" }, { status: 400 });
  }

  const lesson = await prisma.programLesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          program: true,
        },
      },
    },
  });
  if (!lesson) {
    return NextResponse.json({ error: "lesson_not_found" }, { status: 404 });
  }

  const programId = lesson.module.programId;
  const enrollment = await prisma.programEnrollment.findUnique({
    where: {
      userId_programId: {
        userId: session.user.id,
        programId,
      },
    },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "not_enrolled" }, { status: 403 });
  }

  await prisma.programProgress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId: enrollment.id,
        lessonId,
      },
    },
    update: {
      completed: true,
      completedAt: new Date(),
      phase: lesson.module.phase,
    },
    create: {
      enrollmentId: enrollment.id,
      lessonId,
      completed: true,
      completedAt: new Date(),
      phase: lesson.module.phase,
    },
  });

  const [totalLessons, completedLessons] = await Promise.all([
    prisma.programLesson.count({
      where: { module: { programId } },
    }),
    prisma.programProgress.count({
      where: { enrollmentId: enrollment.id, completed: true },
    }),
  ]);

  const progressPercent = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  await prisma.programEnrollment.update({
    where: { id: enrollment.id },
    data: { progressPercent },
  });

  const slug = lesson.module.program.slug;
  revalidatePath(paths.public.program(DEFAULT_LOCALE, slug));
  revalidatePath(paths.public.programLesson(DEFAULT_LOCALE, slug, lesson.id));

  return NextResponse.json({ success: true, progressPercent });
}
