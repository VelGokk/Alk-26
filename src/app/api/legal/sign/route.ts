import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") ?? null;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const documentId =
    typeof body?.documentId === "string" ? body.documentId : undefined;
  if (!documentId) {
    return NextResponse.json({ error: "missing_document" }, { status: 400 });
  }

  const legalDocument = await prisma.legalDocument.findUnique({
    where: { id: documentId },
  });
  if (
    !legalDocument ||
    !legalDocument.isActive ||
    legalDocument.roleTarget !== (session.user.role as Role)
  ) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent") ?? undefined;

  await prisma.$transaction([
    prisma.legalSignature.create({
      data: {
        userId: session.user.id,
        legalDocumentId: legalDocument.id,
        versionNumber: legalDocument.versionNumber,
        ip,
        userAgent,
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        pendingLegalUpdate: false,
        signedLegalDocumentId: legalDocument.id,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
