import type { Metadata } from "next";
import type { AppLocale } from "@/lib/i18n";
import PageSections from "@/components/public/PageSections";
import { getPageContent, getPageMetadata } from "@/lib/pages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: AppLocale }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  return getPageMetadata({ slug: "contacto", lang: resolvedParams.lang });
}

export default async function ContactoPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: AppLocale }>;
  searchParams?: Promise<{ tipo?: string; enviado?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const selectedTipo =
    resolvedSearch?.tipo === "formacion" || resolvedSearch?.tipo === "otro"
      ? resolvedSearch.tipo
      : "consultoria";
  const sent = resolvedSearch?.enviado === "1";
  const page = await getPageContent({
    slug: "contacto",
    lang: resolvedParams.lang,
  });

  return (
    <PageSections
      sections={page?.sections ?? []}
      lang={resolvedParams.lang}
      spacing="space-y-16"
      context={{ selectedTipo, sent }}
    />
  );
}
