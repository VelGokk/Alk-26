import "dotenv/config";
import { PrismaClient, LessonVideoProvider } from "@prisma/client";

const prisma = new PrismaClient();

const providerPatterns: [LessonVideoProvider, RegExp][] = [
  ["LOOM", /loom\.com\/share/i],
  ["YOUTUBE", /(youtube\.com|youtu\.be)/i],
  ["VIMEO", /vimeo\.com/i],
];

function detectProvider(url?: string | null): LessonVideoProvider | null {
  if (!url) return null;
  const normalized = url.trim();
  for (const [provider, pattern] of providerPatterns) {
    if (pattern.test(normalized)) {
      return provider;
    }
  }
  return "OTHER";
}

function isValidDuration(value: number | null | undefined) {
  return typeof value === "number" && !Number.isNaN(value);
}

async function fillLessons() {
  const lessons = await prisma.lesson.findMany();
  console.log(`Found ${lessons.length} lessons to inspect.`);

  for (const lesson of lessons) {
    const updates: Record<string, unknown> = {};
    const provider = detectProvider(lesson.videoUrl);
    if (!lesson.videoProvider && provider) {
      updates.videoProvider = provider;
    }
    if (!lesson.loomUrl && provider === "LOOM" && lesson.videoUrl) {
      updates.loomUrl = lesson.videoUrl;
    }
    if (!lesson.durationSeconds && isValidDuration(lesson.durationMin)) {
      updates.durationSeconds = Math.round(lesson.durationMin! * 60);
    }

    if (Object.keys(updates).length === 0) continue;

    await prisma.lesson.update({
      where: { id: lesson.id },
      data: updates,
    });
    console.log(`Updated lesson ${lesson.id} with ${Object.keys(updates).join(", ")}`);
  }
}

async function fillProgramLessons() {
  const lessons = await prisma.programLesson.findMany();
  console.log(`Found ${lessons.length} program lessons to inspect.`);

  for (const lesson of lessons) {
    const updates: Record<string, unknown> = {};
    const provider = detectProvider(lesson.videoUrl);
    if (!lesson.videoProvider && provider) {
      updates.videoProvider = provider;
    }
    if (!lesson.loomUrl && provider === "LOOM" && lesson.videoUrl) {
      updates.loomUrl = lesson.videoUrl;
    }
    if (!lesson.durationSeconds) {
      if (isValidDuration(lesson.durationMin)) {
        updates.durationSeconds = Math.round(lesson.durationMin! * 60);
      } else if (lesson.durationSeconds && isValidDuration(lesson.durationSeconds)) {
        // Already set, skip.
      }
    }

    if (Object.keys(updates).length === 0) continue;

    await prisma.programLesson.update({
      where: { id: lesson.id },
      data: updates,
    });
    console.log(
      `Updated program lesson ${lesson.id} with ${Object.keys(updates).join(", ")}`
    );
  }
}

async function main() {
  try {
    await fillLessons();
    await fillProgramLessons();
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
