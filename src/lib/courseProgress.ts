import type { ProgramProgressSummary } from "@/lib/programs";

type ModuleWithLessons = { lessons?: { id: string }[] };

export function calculateTotalLessons(
  modules: ModuleWithLessons[] | null | undefined
): number {
  if (!modules) return 0;
  return modules.reduce((total, module) => {
    const lessonCount = module.lessons?.length ?? 0;
    return total + lessonCount;
  }, 0);
}

export function calculateCourseProgress(
  modules: ModuleWithLessons[] | null | undefined,
  completedLessonIds: string[]
): number {
  const totalLessons = calculateTotalLessons(modules);
  const uniqueCompleted = new Set(completedLessonIds);

  if (!totalLessons) {
    return 0;
  }

  return Math.round((uniqueCompleted.size / totalLessons) * 100);
}

export async function fetchProgramProgress(
  programId: string
): Promise<{ success: boolean; progress: ProgramProgressSummary }> {
  const response = await fetch(
    `/api/programs/progress?programId=${encodeURIComponent(programId)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("No se pudo obtener el progreso del programa.");
  }

  return response.json();
}

export async function completeProgramLesson(
  lessonId: string
): Promise<{ success: boolean; progressPercent?: number }> {
  const response = await fetch("/api/programs/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lessonId }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo completar la lección.");
  }

  return response.json();
}
