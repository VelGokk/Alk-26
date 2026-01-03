import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import { paths } from "@/lib/paths";
import LocaleSwitcher from "./LocaleSwitcher";
import BrandMark from "./BrandMark";

export default async function PublicNavbar({ lang }: { lang: AppLocale }) {
  const dictionary = await getDictionary(lang);
  const session = await getServerSession(authOptions);
  const navItems = [
    { href: paths.public.home(lang), label: dictionary.nav.home },
    { href: paths.public.consultoria(lang), label: dictionary.nav.consultoria },
    { href: paths.public.formacion(lang), label: dictionary.nav.formacion },
    { href: paths.public.recursos(lang), label: dictionary.nav.recursos },
    { href: paths.public.nosotros(lang), label: dictionary.nav.nosotros },
    { href: paths.public.contacto(lang), label: dictionary.nav.contacto },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <BrandMark href={paths.public.home(lang)} />
        <nav className="hidden items-center gap-6 font-sans text-xs uppercase tracking-[0.24em] text-slate-600 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition duration-200 hover:text-alkaya"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher current={lang} />
          <Link href={paths.public.contacto(lang)} className="btn-primary">
            {dictionary.cta.contact}
          </Link>
          {session?.user ? (
            <Link href={paths.dashboard.app(lang)} className="btn-secondary">
              {dictionary.cta.dashboard}
            </Link>
          ) : (
            <Link href={paths.public.auth(lang)} className="btn-secondary">
              {dictionary.cta.login}
            </Link>
          )}
        </div>
        <details className="relative md:hidden">
          <summary className="list-none cursor-pointer rounded-full border border-line bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-deep font-sans">
            {dictionary.nav.menu}
          </summary>
          <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-line bg-white/95 p-4 shadow-soft">
            <div className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 font-sans">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Link href={paths.public.contacto(lang)} className="btn-primary">
                {dictionary.cta.contact}
              </Link>
              {session?.user ? (
                <Link href={paths.dashboard.app(lang)} className="btn-secondary">
                  {dictionary.cta.dashboard}
                </Link>
              ) : (
                <Link href={paths.public.auth(lang)} className="btn-secondary">
                  {dictionary.cta.login}
                </Link>
              )}
              <LocaleSwitcher current={lang} />
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
