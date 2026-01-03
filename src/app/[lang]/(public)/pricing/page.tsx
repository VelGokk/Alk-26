import { redirect } from "next/navigation";
import type { AppLocale } from "@/lib/i18n";

export default function PricingRedirect({
  params,
}: {
  params: { lang: AppLocale };
}) {
  redirect(`/${params.lang}/contacto`);
}

