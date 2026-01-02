import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function CertificatesPage({
  params,
}: {
  params: { lang: string };
}) {
  await requireRole([Role.USER, Role.SUBSCRIBER, Role.SUPERADMIN]);
  const session = await getServerSession(authOptions);
  const completed = await prisma.enrollment.findMany({
    where: { userId: session?.user.id, progressPercent: { gte: 100 } },
    include: { course: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Certificados
        </p>
        <h1 className="font-heading text-3xl">Tus logros</h1>
      </div>
      {completed.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
          Finalizá cursos para desbloquear certificados.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {completed.map((enrollment) => (
            <div key={enrollment.id} className="glass-panel rounded-2xl p-6">
              <p className="font-heading text-xl">{enrollment.course.title}</p>
              <p className="text-sm text-zinc-600">
                Certificado disponible
              </p>
              <Link
                href={`/${params.lang}/app/certificates/${enrollment.id}`}
                className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
              >
                Ver certificado
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
