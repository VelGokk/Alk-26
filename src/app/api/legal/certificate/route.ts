import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== Role.SUPERADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const signatureId = req.nextUrl.searchParams.get("signatureId");
  if (!signatureId) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const signature = await prisma.legalSignature.findUnique({
    where: { id: signatureId },
    include: {
      user: true,
      legalDocument: true,
    },
  });

  if (!signature || !signature.legalDocument) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let PDFDocument: any;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PDFDocument = eval("require")("pdfkit");
  } catch {
    const mod = await import("pdfkit");
    PDFDocument = mod.default;
  }

  const doc = new PDFDocument({ margin: 48, size: "A4" });
  const chunks: Buffer[] = [];

  const bufferPromise = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  doc.fontSize(18).font("Helvetica-Bold").text("Certificado de Cumplimiento", {
    align: "center",
  });
  doc.moveDown();
  doc.fontSize(12).font("Helvetica").text(
    `Usuario: ${signature.user.name ?? signature.user.email ?? "N/A"}`
  );
  doc.text(`Email: ${signature.user.email}`);
  doc.text(
    `Rol: ${signature.legalDocument.roleTarget} · Versión ${signature.versionNumber}`
  );
  doc.text(`Fecha de firma: ${new Date(signature.signedAt).toLocaleString()}`);
  if (signature.ip) {
    doc.text(`IP: ${signature.ip}`);
  }
  if (signature.userAgent) {
    doc.text(`User Agent: ${signature.userAgent}`);
  }
  doc.moveDown();
  doc.fontSize(14).font("Helvetica-Bold").text("Contenido firmado:");
  doc.moveDown(0.5);
  const plainContent = signature.legalDocument.content.replace(/<[^>]+>/g, "");
  doc.fontSize(11).font("Helvetica").text(plainContent, {
    align: "justify",
  });

  doc.end();
  const pdfBuffer = await bufferPromise;

  const safeUser =
    (signature.user.email ?? signature.user.id).replace(/[^a-z0-9@._-]/gi, "_");
  const fileName = `certificado-${safeUser}.pdf`;
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
