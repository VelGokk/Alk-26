import { ReactNode } from "react";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { getSystemSettings } from "@/lib/settings";
import MaintenanceBanner from "@/components/public/MaintenanceBanner";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const settings = await getSystemSettings();
  const resolvedParams = await params;
  const lang = resolvedParams.lang ?? DEFAULT_LOCALE;

  return (
    <div lang={lang} className="min-h-screen">
      {settings.maintenanceMode ? (
        <MaintenanceBanner message={settings.maintenanceMessage} />
      ) : null}
      {children}
    </div>
  );
}
