import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { getPagePath } from "@/lib/pages";

export default async function PagesList({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await requireRole([Role.SUPERADMIN]);
  const resolvedParams = await params;
  const pages = await prisma.page.findMany({
    orderBy: [{ slug: "asc" }, { lang: "asc" }],
    select: {
      id: true,
      slug: true,
      lang: true,
      seoTitle: true,
      updatedAt: true,
      _count: { select: { sections: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          CMS
        </p>
        <h1 className="font-heading text-3xl">Paginas publicas</h1>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <div className="space-y-4">
          {pages.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No hay paginas creadas todavia.
            </p>
          ) : (
            pages.map((page) => (
              <div
                key={page.id}
                className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {page.lang}
                  </p>
                  <h2 className="font-heading text-xl">
                    {page.slug}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    {page._count.sections} secciones
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
                  <Link
                    href={`/${resolvedParams.lang}/super-admin/pages/${page.slug}?lang=${page.lang}`}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-zinc-600"
                  >
                    Editar
                  </Link>
                  <Link
                    href={getPagePath(page.slug, page.lang)}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-zinc-600"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
