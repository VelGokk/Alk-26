import { redirect } from "next/navigation";
import type { AppLocale } from "@/lib/i18n";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { paths } from "@/lib/paths";

export default async function ProgramasPage({
  params,
}: {
  params: Promise<{ lang: AppLocale }>;
}) {
  const resolvedParams = await params;
  const lang = isLocale(resolvedParams.lang)
    ? resolvedParams.lang
    : DEFAULT_LOCALE;
  redirect(paths.public.programs(lang));
}
