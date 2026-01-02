import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OPTIONAL_ENV } from "@/lib/env";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const integrations = OPTIONAL_ENV.reduce<Record<string, boolean>>(
      (acc, key) => {
        acc[key] = Boolean(process.env[key]);
        return acc;
      },
      {}
    );
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      integrations,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "DB unreachable" },
      { status: 500 }
    );
  }
}
