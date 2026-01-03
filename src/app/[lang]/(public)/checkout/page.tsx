import { redirect } from "next/navigation";
import type { AppLocale } from "@/lib/i18n";

export default function CheckoutRedirect({
  params,
}: {
  params: { lang: AppLocale };
}) {
  redirect(`/${params.lang}/contacto`);
}

