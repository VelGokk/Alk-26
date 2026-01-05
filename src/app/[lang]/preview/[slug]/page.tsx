import PageSections from "@/components/public/PageSections";
import { getPageContent } from "@/lib/pages";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams?: { token?: string };
}) {
  const resolvedParams = await params;
  const token = searchParams?.token;
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

  const session = await getServerSession(authOptions);
  const roles =
    session?.user?.roles ??
    (session?.user?.role ? [session.user.role] : []) ??
    [];
  const isSuperAdmin = roles.includes(Role.SUPERADMIN);
  const hasToken = Boolean(page.previewToken && token && page.previewToken === token);

  if (!hasToken && !isSuperAdmin) {
    return (
      <div className="p-10 text-sm text-zinc-500">
        Acceso restringido. Usá el enlace secreto o iniciá sesión como Superadmin.
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-slate-50 py-10">
      <PageSections
        sections={page.sections}
        lang={resolvedParams.lang}
        spacing="space-y-20"
      />
    </div>
  );
}
