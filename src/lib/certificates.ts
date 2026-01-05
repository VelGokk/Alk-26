"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getProgramProgressSegments } from "@/lib/programs";

export async function ensureCertificateForEnrollment(enrollmentId: string) {
  const existing = await prisma.certificate.findUnique({
    where: { enrollmentId },
  });
  if (existing) {
    return existing;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: true,
      program: true,
    },
  });
  if (!enrollment) return null;

  const progress = await getProgramProgressSegments(
    enrollment.programId,
    enrollment.userId
  );
  const allPhasesCompleted = progress.segments.every(
    (segment) => segment.total === 0 || segment.percent === 100
  );
  if (!allPhasesCompleted) {
    return null;
  }

  const issuedAt = new Date();
  const certificateNumber = crypto
    .createHash("sha256")
    .update(`${enrollment.userId}-${enrollment.programId}-${issuedAt.toISOString()}`)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();

  const metadata = {
    segments: progress.segments,
    overallPercent: progress.overallPercent,
  };

  return prisma.certificate.create({
    data: {
      enrollmentId,
      userId: enrollment.userId,
      programId: enrollment.programId,
      certificateNumber,
      issuedAt,
      metadata,
    },
  });
}

export async function getCertificatesForUser(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: "desc" },
    include: {
      enrollment: {
        include: {
          course: true,
        },
      },
      program: true,
    },
  });
}

export async function getCertificateById(id: string) {
  return prisma.certificate.findUnique({
    where: { id },
    include: {
      enrollment: {
        include: { user: true, course: true, program: true },
      },
      user: true,
      program: true,
    },
  });
}

export async function generateCertificatePdf(certificate: {
  certificateNumber: string;
  issuedAt: Date;
  user: { name?: string | null; email?: string | null };
  program: { title: string };
}) {
  return new Promise<Buffer>(async (resolve, reject) => {
    let PDFDocument: any;
    try {
      // Obfuscate require call to avoid static bundler analysis
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PDFDocument = eval("requ" + "ire")("pdfkit");
    } catch {
      const mod = await import("pdfkit");
      PDFDocument = mod.default;
    }

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 64, bottom: 64, left: 64, right: 64 },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.font("Times-Bold").fontSize(20).text("ALKAYA CERTIFICATE", {
      align: "center",
    });
    doc.moveDown(1.5);
    doc.font("Times-Roman").fontSize(14).text(
      `This certifies that ${certificate.user.name ?? certificate.user.email ?? "Anonymous"} has completed the program "${certificate.program.title}".`,
      {
        align: "center",
        lineGap: 6,
      }
    );
    doc.moveDown(2);
    doc.fontSize(12).text(`Certificate Number: ${certificate.certificateNumber}`, {
      align: "center",
    });
    doc.text(`Issued: ${certificate.issuedAt.toISOString().split("T")[0]}`, {
      align: "center",
    });
    doc.moveDown(1);
    doc
      .fontSize(10)
      .text(
        "Verifiable at ALKAYA LMS with the certificate ID above. This PDF is deterministic and reproducible from the stored records.",
        { align: "center" }
      );
    doc.end();
  });
}
