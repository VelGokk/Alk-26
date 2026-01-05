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
  // PDF generation is disabled during the Next/Turbopack build to avoid
  // bundling native-heavy libraries (pdfkit/fontkit) into the server bundle.
  // Move PDF generation to an external service or a separate runtime worker.
  // Callers should handle this error and fallback to a placeholder or a
  // remote PDF generation endpoint.
  throw new Error(
    "PDF generation is disabled in this build. Use the external PDF service."
  );
}
