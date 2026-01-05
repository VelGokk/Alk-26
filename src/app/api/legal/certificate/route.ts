import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// PDF generation temporarily disabled to allow production build.
export async function GET() {
  return NextResponse.json(
    { error: "pdf_generation_disabled", message: "Generación de PDFs deshabilitada temporalmente para permitir build en Vercel." },
    { status: 501 }
  );
