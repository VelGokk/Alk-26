import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseActiveRole } from "@/lib/auth/activeRole";
import { Role } from "@prisma/client";

const ensureSuperAdmin = (session: Awaited<ReturnType<typeof getServerSession>>) => {
  if (!session?.user || session.user.role !== Role.SUPERADMIN) {
    throw new Error("Forbidden");
  }
  return session;
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    ensureSuperAdmin(session);

    const url = new URL(req.url);
    const roleParam = parseActiveRole(url.searchParams.get("role") ?? undefined);
    const targetRole = roleParam ?? Role.SUPERADMIN;

    const documents = await prisma.legalDocument.findMany({
      where: { roleTarget: targetRole },
      orderBy: { versionNumber: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Unauthorized" },
      { status: 403 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    ensureSuperAdmin(session);

    const payload = await req.json().catch(() => ({}));
    const roleTarget =
      parseActiveRole(payload?.roleTarget) ??
      (session.user.role as Role) ??
      Role.SUPERADMIN;
    const title = typeof payload?.title === "string" ? payload.title.trim() : "";
    const content =
      typeof payload?.content === "string" ? payload.content : "";

    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }
    if (!content.trim()) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    const latest = await prisma.legalDocument.findFirst({
      where: { roleTarget },
      orderBy: { versionNumber: "desc" },
    });
    const nextVersion = (latest?.versionNumber ?? 0) + 1;

    await prisma.$transaction([
      prisma.legalDocument.updateMany({
        where: { roleTarget, isActive: true },
        data: { isActive: false },
      }),
      prisma.legalDocument.create({
        data: {
          roleTarget,
          title,
          content,
          versionNumber: nextVersion,
          isActive: true,
        },
      }),
      prisma.user.updateMany({
        where: { role: roleTarget },
        data: { pendingLegalUpdate: true },
      }),
    ]);

    return NextResponse.json({ version: nextVersion });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Unauthorized" },
      { status: 403 }
    );
  }
}
