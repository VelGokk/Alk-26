import { NextResponse } from "next/server";

// PDF generation temporarily disabled to allow production build.
export async function GET() {
  return NextResponse.json(
    { error: "pdf_generation_disabled", message: "Generación de PDFs deshabilitada temporalmente para permitir build en Vercel." },
    { status: 501 }
  );
}
