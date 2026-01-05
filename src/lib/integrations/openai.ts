import OpenAI from "openai";
import { hasEnv } from "@/lib/env";
import { AI_PROMPTS } from "@/config/ai";

export const isOpenAIConfigured = hasEnv("OPENAI_API_KEY");

const client = isOpenAIConfigured
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateQuiz(prompt: string) {
  if (!client) {
    throw new Error("OpenAI not configured");
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Sos un generador de quizzes educativos." },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
  });

  return completion.choices[0]?.message?.content ?? "";
}

export async function generateMirrorQuestions(content: string) {
  if (!client) {
    throw new Error("OpenAI not configured");
  }

  const prompt = AI_PROMPTS.mirror.user(content);
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: AI_PROMPTS.mirror.system },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
  });

  return completion.choices[0]?.message?.content ?? "";
}
