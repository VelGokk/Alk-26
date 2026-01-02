import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CertificateDetail({
  params,
}: {
  params: { enrollmentId: string };
}) {
  const session = await getServerSession(authOptions);
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: params.enrollmentId },
    include: { course: true, user: true },
  });

  if (!enrollment || enrollment.userId !== session?.user.id) {
    return <div className="text-sm text-zinc-600">Certificado no disponible.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Certificado
        </p>
        <h1 className="font-heading text-3xl">{enrollment.course.title}</h1>
      </div>
      <div className="glass-panel rounded-2xl p-8 text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          ALKAYA LMS
        </p>
        <p className="font-heading text-2xl">Certificado de finalización</p>
        <p className="text-sm text-zinc-600">
          Se certifica que{" "}
          <strong>{enrollment.user.name ?? enrollment.user.email}</strong>{" "}
          completó el curso <strong>{enrollment.course.title}</strong>.
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Placeholder funcional · Exportación PDF próximamente
        </p>
      </div>
    </div>
  );
}
