import { redirect } from "next/navigation";
import type { AppLocale } from "@/lib/i18n";

export default async function ResourcesRedirect({
  params,
}: {
  params: Promise<{ lang: AppLocale }>;
}) {
  const resolvedParams = await params;
  redirect(`/${resolvedParams.lang}/recursos`);
}
