import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { paths } from "@/lib/paths";
import { DEFAULT_LOCALE } from "@/config/i18n";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const slug = typeof body?.slug === "string" ? body.slug : "";
  if (!slug) {
    return NextResponse.json({ error: "missing_program" }, { status: 400 });
  }

  const program = await prisma.program.findUnique({
    where: { slug },
    select: { id: true, published: true },
  });
  if (!program || !program.published) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.programEnrollment.upsert({
    where: {
      userId_programId: {
        userId: session.user.id,
        programId: program.id,
      },
    },
    update: { status: "ACTIVE" },
    create: {
      userId: session.user.id,
      programId: program.id,
      status: "ACTIVE",
    },
  });

  revalidatePath(paths.public.program(DEFAULT_LOCALE, slug));

  return NextResponse.json({ success: true });
}
