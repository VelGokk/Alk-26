import { redirect } from "next/navigation";
import type { AppLocale } from "@/lib/i18n";

export default function CheckoutFailureRedirect({
  params,
}: {
  params: { lang: AppLocale };
}) {
  redirect(`/${params.lang}/contacto`);
}

