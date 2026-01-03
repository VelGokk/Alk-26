import { NextResponse } from "next/server";
import { generateQuiz, isOpenAIConfigured } from "@/lib/integrations/openai";

export async function POST(request: Request) {
  if (!isOpenAIConfigured) {
    return NextResponse.json(
      { error: "AI no configurada" },
      { status: 501 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const prompt = body?.prompt ?? "Genera un quiz breve sobre el curso.";
  const result = await generateQuiz(prompt);
  return NextResponse.json({ result });
}

