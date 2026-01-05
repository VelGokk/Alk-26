import PageSections from "@/components/public/PageSections";
import { getPageContent } from "@/lib/pages";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  await requireRole([Role.SUPERADMIN]);
  const page = await getPageContent({
    slug: resolvedParams.slug,
    lang: resolvedParams.lang,
    preview: true,
  });

  if (!page) {
    return (
      <div className="p-10 text-sm text-zinc-500">
        Página no encontrada para vista previa.
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-slate-50 py-10">
      <PageSections
        sections={page.sections ?? []}
        lang={resolvedParams.lang}
        spacing="space-y-20"
      />
    </div>
  );
}
