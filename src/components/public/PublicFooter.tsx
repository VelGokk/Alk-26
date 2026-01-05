import Link from "next/link";
import { createTranslator, getDictionary, type AppLocale } from "@/lib/i18n";
import { paths } from "@/lib/paths";

export default async function PublicFooter({ lang }: { lang: AppLocale }) {
  const dictionary = await getDictionary(lang);
  const translate = createTranslator(dictionary);

  return (
    <footer className="mt-24 border-t border-line bg-white/70">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr]">
        <div>
          <p className="font-heading text-xl text-deep">{translate("brand")}</p>
          <p className="mt-3 text-sm text-slate-600">
            {translate("footer.description")}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500 font-sans">
            {translate("footer.mantra")}
          </p>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-deep">
            {translate("footer.exploreTitle")}
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={paths.public.home(lang)}>{translate("nav.home")}</Link>
            </li>
            <li>
              <Link href={paths.public.consultoria(lang)}>
                {translate("nav.consultoria")}
              </Link>
            </li>
            <li>
              <Link href={paths.public.formacion(lang)}>
                {translate("nav.formacion")}
              </Link>
            </li>
            <li>
              <Link href={paths.public.recursos(lang)}>
                {translate("nav.recursos")}
              </Link>
            </li>
            <li>
              <Link href={paths.public.nosotros(lang)}>
                {translate("nav.nosotros")}
              </Link>
            </li>
            <li>
              <Link href={paths.public.contacto(lang)}>
                {translate("nav.contacto")}
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-deep">
            {translate("footer.contactTitle")}
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={paths.public.contacto(lang)}>
                {translate("cta.contact")}
              </Link>
            </li>
            <li>{dictionary.footer.contactEmail}</li>
            <li>{dictionary.footer.contactPhone}</li>
            <li>{dictionary.footer.contactRegions}</li>
          </ul>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-deep">
            {translate("footer.legalTitle")}
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={paths.public.privacidad(lang)}>
                {translate("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link href={paths.public.terminos(lang)}>
                {translate("footer.terms")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-4 py-6 text-center text-xs uppercase tracking-[0.24em] text-slate-500 font-sans">
        {translate("footer.copyright")}
      </div>
    </footer>
  );
}
