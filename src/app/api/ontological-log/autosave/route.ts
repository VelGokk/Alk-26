import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveOntologicalLog } from "@/lib/ontological-logs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const programId =
    typeof body?.programId === "string" ? body.programId : undefined;
  const content =
    typeof body?.content === "string" ? body.content : undefined;
  const isPrivate = Boolean(body?.isPrivate);

  if (!programId || content === undefined) {
    return NextResponse.json(
      { error: "missing_fields" },
      { status: 400 }
    );
  }

  const log = await saveOntologicalLog({
    programId,
    userId: session.user.id,
    content,
    isPrivate,
  });

  return NextResponse.json({
    id: log.id,
    updatedAt: log.updatedAt.toISOString(),
  });
}
