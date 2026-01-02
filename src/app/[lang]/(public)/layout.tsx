import { ReactNode } from "react";
import { type AppLocale } from "@/lib/i18n";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: any;
}) {
  return (
    <div className="bg-grid">
      <PublicNavbar lang={params.lang} />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        {children}
      </main>
      <PublicFooter lang={params.lang} />
    </div>
  );
}
