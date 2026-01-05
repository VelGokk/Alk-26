import { ProgramPhase } from "@prisma/client";
import type { ProgramEnrollment } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getProgramCatalog() {
  return prisma.program.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      modules: {
        select: {
          lessons: {
            select: { id: true },
          },
        },
      },
      tagRelations: {
        include: { tag: true },
      },
    },
  });
}

export async function getProgramBySlug(slug: string) {
  return prisma.program.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              resources: {
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      },
      tagRelations: {
        include: { tag: true },
      },
    },
  });
}

export async function getProgramLessonById(lessonId: string) {
  return prisma.programLesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          program: true,
          lessons: {
            select: { id: true },
          },
        },
      },
      resources: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getUserProgramEnrollment(
  programId: string,
  userId: string
): Promise<
  (ProgramEnrollment & {
    progress: {
      lessonId: string;
      completed: boolean;
    }[];
  }) | null
> {
  return prisma.programEnrollment.findUnique({
    where: {
      userId_programId: {
        userId,
        programId,
      },
    },
    include: {
      progress: {
        select: {
          lessonId: true,
          completed: true,
          phase: true,
        },
      },
    },
  });
}

type SegmentKey = "observacion" | "orden" | "accion" | "sostenimiento";

interface SegmentPlan {
  key: SegmentKey;
  lessons: string[];
}

export interface ProgramProgressSummary {
  segments: {
    key: SegmentKey;
    total: number;
    completed: number;
    percent: number;
  }[];
  overallPercent: number;
  totalLessons: number;
}

export async function getProgramProgressSegments(
  programId: string,
  userId: string
): Promise<ProgramProgressSummary> {
  const enrollment = await prisma.programEnrollment.findUnique({
    where: { userId_programId: { userId, programId } },
    include: {
      progress: {
        select: {
          lessonId: true,
          completed: true,
        },
      },
    },
  });

  const modules = await prisma.programModule.findMany({
    where: { programId },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: { id: true },
      },
    },
  });

  const discoveryLessons = modules
    .filter((module) => module.phase === ProgramPhase.DISCOVERY)
    .flatMap((module) => module.lessons.map((lesson) => lesson.id));
  const sustainmentLessons = modules
    .filter((module) => module.phase === ProgramPhase.SUSTAINMENT)
    .flatMap((module) => module.lessons.map((lesson) => lesson.id));

  const practiceModules = modules.filter(
    (module) => module.phase === ProgramPhase.PRACTICE
  );
  const split = Math.ceil(practiceModules.length / 2);
  const ordenModules = practiceModules.slice(0, split);
  const accionModules = practiceModules.slice(split);

  const ordenLessons = ordenModules.flatMap((module) =>
    module.lessons.map((lesson) => lesson.id)
  );
  const accionLessons = accionModules.flatMap((module) =>
    module.lessons.map((lesson) => lesson.id)
  );

  const plan: SegmentPlan[] = [
    { key: "observacion", lessons: discoveryLessons },
    { key: "orden", lessons: ordenLessons },
    { key: "accion", lessons: accionLessons },
    { key: "sostenimiento", lessons: sustainmentLessons },
  ];

  const completedSet = new Set(
    enrollment?.progress
      .filter((entry) => entry.completed)
      .map((entry) => entry.lessonId) ?? []
  );

  const segments = plan.map((segment) => {
    const total = segment.lessons.length;
    const completed = segment.lessons.filter((lessonId) =>
      completedSet.has(lessonId)
    ).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    return { key: segment.key, total, completed, percent };
  });

  const totalLessons = segments.reduce((sum, segment) => sum + segment.total, 0);
  const totalCompleted = segments.reduce(
    (sum, segment) => sum + segment.completed,
    0
  );
  const overallPercent = totalLessons
    ? Math.round((totalCompleted / totalLessons) * 100)
    : 0;

  return { segments, overallPercent, totalLessons };
}
