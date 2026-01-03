import Link from "next/link";
import { getDictionary, type AppLocale } from "@/lib/i18n";

export default async function PublicFooter({ lang }: { lang: AppLocale }) {
  const dictionary = await getDictionary(lang);

  return (
    <footer className="mt-24 border-t border-line bg-white/70">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr]">
        <div>
          <p className="font-heading text-xl text-deep">{dictionary.brand}</p>
          <p className="mt-3 text-sm text-slate-600">
            {dictionary.footer.description}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500 font-sans">
            {dictionary.footer.mantra}
          </p>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-deep">
            {dictionary.footer.exploreTitle}
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={`/${lang}`}>{dictionary.nav.home}</Link>
            </li>
            <li>
              <Link href={`/${lang}/consultoria`}>
                {dictionary.nav.consultoria}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/formacion`}>
                {dictionary.nav.formacion}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/recursos`}>
                {dictionary.nav.recursos}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/nosotros`}>
                {dictionary.nav.nosotros}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/contacto`}>
                {dictionary.nav.contacto}
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-deep">
            {dictionary.footer.contactTitle}
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={`/${lang}/contacto`}>{dictionary.cta.contact}</Link>
            </li>
            <li>{dictionary.footer.contactEmail}</li>
            <li>{dictionary.footer.contactPhone}</li>
            <li>{dictionary.footer.contactRegions}</li>
          </ul>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-deep">
            {dictionary.footer.legalTitle}
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={`/${lang}/privacidad`}>
                {dictionary.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/terminos`}>{dictionary.footer.terms}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-4 py-6 text-center text-xs uppercase tracking-[0.24em] text-slate-500 font-sans">
        {dictionary.footer.copyright}
      </div>
    </footer>
  );
}


