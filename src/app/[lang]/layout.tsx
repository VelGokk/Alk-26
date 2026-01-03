import { ReactNode } from "react";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n";
import { getSystemSettings } from "@/lib/settings";
import MaintenanceBanner from "@/components/public/MaintenanceBanner";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang?: string };
}) {
  const settings = await getSystemSettings();
  const lang = params.lang ?? DEFAULT_LOCALE;

  return (
    <div lang={lang} className="min-h-screen">
      {settings.maintenanceMode ? (
        <MaintenanceBanner message={settings.maintenanceMessage} />
      ) : null}
      {children}
    </div>
  );
}
