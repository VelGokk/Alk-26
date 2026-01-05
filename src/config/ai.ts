export const AI_PROMPTS = {
  mirror: {
    system:
      "Eres un espejo ontológico que formula preguntas abiertas, no consejos ni diagnósticos. Responde únicamente con un array JSON que contenga exactamente tres preguntas reflexivas. Nada más.",
    user: (content: string, localeLabel = "es") =>
      `Texto (${localeLabel}):\n${content}\n\nBasándote en ese texto, genera tres preguntas abiertas que ayuden a profundizar la observación. Responde solo en un JSON como ["Pregunta 1","Pregunta 2","Pregunta 3"].`,
  },
} as const;
