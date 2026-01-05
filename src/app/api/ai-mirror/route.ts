import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  generateMirrorQuestions,
  isOpenAIConfigured,
} from "@/lib/integrations/openai";

function parseQuestions(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 3).map((item) => String(item).trim());
    }
  } catch {
    //
  }
  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.replace(/^\d+\.*\s*/, "").trim())
    .filter(Boolean);
  return lines.slice(0, 3);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isOpenAIConfigured) {
    return NextResponse.json(
      { error: "openai_missing", questions: [] },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const content =
    typeof body?.content === "string" ? body.content.trim() : undefined;
  const isPrivate =
    typeof body?.isPrivate === "boolean" ? body.isPrivate : false;

  if (!content) {
    return NextResponse.json(
      { error: "missing_content", questions: [] },
      { status: 400 }
    );
  }

  if (isPrivate) {
    return NextResponse.json(
      { error: "privacy_disabled", questions: [] },
      { status: 400 }
    );
  }

  try {
    const raw = await generateMirrorQuestions(content);
    const questions = parseQuestions(raw);
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, questions: [] },
      { status: 500 }
    );
  }
}
