import { ReactNode } from "react";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = isLocale(resolvedParams.lang) ? resolvedParams.lang : DEFAULT_LOCALE;
  return (
    <div className="min-h-screen bg-grid">
      <PublicNavbar lang={lang} />
      <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        {children}
      </main>
      <PublicFooter lang={lang} />
    </div>
  );
}
