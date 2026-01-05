import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ACTIVE_ROLE_COOKIE, parseActiveRole } from "@/lib/auth/activeRole";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const requestedRole = parseActiveRole(body?.role);
  if (!requestedRole) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const userId = session.user.id;
  const hasRole =
    session.user.role === requestedRole ||
    session.user.roles?.includes(requestedRole);

  if (!hasRole) {
    const fallback = await prisma.userRole.findFirst({
      where: { userId, role: requestedRole },
      select: { id: true },
    });
    if (!fallback) {
      return NextResponse.json({ error: "Rol no habilitado" }, { status: 403 });
    }
  }

  const response = NextResponse.json({ role: requestedRole });
  response.cookies.set(ACTIVE_ROLE_COOKIE, requestedRole, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
