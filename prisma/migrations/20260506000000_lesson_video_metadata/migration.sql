-- CreateEnum
CREATE TYPE "LessonVideoProvider" AS ENUM ('YOUTUBE', 'VIMEO', 'LOOM', 'OTHER');

-- Add columns to Lesson
ALTER TABLE "Lesson"
  ADD COLUMN "videoProvider" "LessonVideoProvider";
ALTER TABLE "Lesson"
  ADD COLUMN "loomUrl" TEXT;
ALTER TABLE "Lesson"
  ADD COLUMN "durationSeconds" INTEGER;

-- Add columns to ProgramLesson
ALTER TABLE "ProgramLesson"
  ADD COLUMN "videoProvider" "LessonVideoProvider";
ALTER TABLE "ProgramLesson"
  ADD COLUMN "loomUrl" TEXT;
ALTER TABLE "ProgramLesson"
  ADD COLUMN "durationSeconds" INTEGER;
