import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProgramProgressSegments } from "@/lib/programs";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const programId = request.nextUrl.searchParams.get("programId");
  if (!programId) {
    return NextResponse.json({ error: "missing_program" }, { status: 400 });
  }

  const progress = await getProgramProgressSegments(programId, session.user.id);
  return NextResponse.json({ success: true, progress });
}
