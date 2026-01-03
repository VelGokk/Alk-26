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
  return getPageMetadata({ slug: "formacion", lang: resolvedParams.lang });
}

export default async function FormacionPage({
  params,
}: {
  params: Promise<{ lang: AppLocale }>;
}) {
  const resolvedParams = await params;
  const page = await getPageContent({
    slug: "formacion",
    lang: resolvedParams.lang,
  });

  return (
    <PageSections
      sections={page?.sections ?? []}
      lang={resolvedParams.lang}
      spacing="space-y-16"
    />
  );
}
