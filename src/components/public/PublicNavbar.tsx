import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";
import BrandMark from "./BrandMark";

export default async function PublicNavbar({ lang }: { lang: AppLocale }) {
  const dictionary = await getDictionary(lang);
  const session = await getServerSession(authOptions);

  return (
    <header className="w-full border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <BrandMark href={`/${lang}`} />
        <nav className="hidden items-center gap-6 text-sm uppercase tracking-[0.2em] text-zinc-600 md:flex">
          <Link href={`/${lang}`}>{dictionary.nav.home}</Link>
          <Link href={`/${lang}/blog`}>{dictionary.nav.blog}</Link>
          <Link href={`/${lang}/courses`}>{dictionary.nav.courses}</Link>
          <Link href={`/${lang}/resources`}>{dictionary.nav.resources}</Link>
          <Link href={`/${lang}/pricing`}>{dictionary.nav.pricing}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher current={lang} />
          {session?.user ? (
            <Link
              href={`/${lang}/app`}
              className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
            >
              {dictionary.cta.dashboard}
            </Link>
          ) : (
            <Link
              href={`/${lang}/auth`}
              className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
            >
              {dictionary.cta.login}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
