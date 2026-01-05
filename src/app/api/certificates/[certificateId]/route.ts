import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCertificateById } from "@/lib/certificates";

export async function GET(
  _: Request,
  { params }: { params: { certificateId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const certificate = await getCertificateById(params.certificateId);
  if (!certificate) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  const isAdmin =
    session.user.role === Role.ADMIN || session.user.role === Role.SUPERADMIN;
  if (!isAdmin && certificate.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { generateCertificatePdf } = await import("@/lib/certificates");
  const pdf = await generateCertificatePdf({
    certificateNumber: certificate.certificateNumber,
    issuedAt: certificate.issuedAt,
    user: {
      name: certificate.user?.name ?? null,
      email: certificate.user?.email ?? null,
    },
    program: {
      title: certificate.program.title,
    },
  });

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`,
    },
  });
}
