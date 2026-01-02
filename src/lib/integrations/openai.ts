import OpenAI from "openai";
import { hasEnv } from "@/lib/env";

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
