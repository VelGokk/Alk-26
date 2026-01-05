import { prisma } from "@/lib/prisma";

export type OntologicalLogRecord = {
  id: string;
  content: string;
  isPrivate: boolean;
  updatedAt: string;
};

export async function getUserOntologicalLog(
  programId: string,
  userId: string
) {
  return prisma.ontologicalLog.findUnique({
    where: {
      userId_programId: {
        userId,
        programId,
      },
    },
  });
}

export async function saveOntologicalLog({
  programId,
  userId,
  content,
  isPrivate,
}: {
  programId: string;
  userId: string;
  content: string;
  isPrivate: boolean;
}) {
  const record = await prisma.ontologicalLog.upsert({
    where: {
      userId_programId: {
        userId,
        programId,
      },
    },
    create: {
      programId,
      userId,
      content,
      isPrivate,
    },
    update: {
      content,
      isPrivate,
    },
  });
  return record;
}
