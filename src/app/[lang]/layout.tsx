import { ReactNode } from "react";
import {
  AppDictionary,
  AppLocale,
  DEFAULT_LOCALE,
  getDictionary,
  isLocale,
} from "@/lib/i18n";
import { getSystemSettings } from "@/lib/settings";
import MaintenanceBanner from "@/components/public/MaintenanceBanner";
import { UniversalSearch } from "@/components/ui/UniversalSearch";

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
  const requestedLang = resolvedParams.lang ?? DEFAULT_LOCALE;
  const resolvedLang: AppLocale = isLocale(requestedLang)
    ? requestedLang
    : DEFAULT_LOCALE;
  const dictionary: AppDictionary = await getDictionary(resolvedLang);

  return (
    <div lang={resolvedLang} className="min-h-screen">
      {settings.maintenanceMode ? (
        <MaintenanceBanner message={settings.maintenanceMessage} />
      ) : null}
      {children}
      <UniversalSearch dictionary={dictionary} lang={resolvedLang} />
    </div>
  );
}
