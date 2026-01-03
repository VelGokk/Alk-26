import Link from "next/link";

export default function PublicFooter({ lang }: { lang: string }) {
  return (
    <footer className="mt-24 border-t border-line bg-white/70">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr]">
        <div>
          <p className="font-heading text-xl text-deep">ALKAYA</p>
          <p className="mt-3 text-sm text-slate-600">
            Consultora de coaching ontologico para lideres, equipos y
            organizaciones que necesitan sostener el cambio.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500 font-sans">
            No cambiamos personas. Cambiamos como observas y decidis.
          </p>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-deep">Explorar</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={`/${lang}`}>Inicio</Link>
            </li>
            <li>
              <Link href={`/${lang}/consultoria`}>Consultoria</Link>
            </li>
            <li>
              <Link href={`/${lang}/formacion`}>Formacion</Link>
            </li>
            <li>
              <Link href={`/${lang}/recursos`}>Recursos</Link>
            </li>
            <li>
              <Link href={`/${lang}/nosotros`}>Nosotros</Link>
            </li>
            <li>
              <Link href={`/${lang}/contacto`}>Contacto</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-deep">Contacto</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={`/${lang}/contacto`}>Hablar con un consultor</Link>
            </li>
            <li>hola@alkaya.com</li>
            <li>+54 11 5555-5555</li>
            <li>Buenos Aires - CDMX - Remoto</li>
          </ul>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-deep">Legal</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={`/${lang}/privacidad`}>Politica de privacidad</Link>
            </li>
            <li>
              <Link href={`/${lang}/terminos`}>Terminos</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-4 py-6 text-center text-xs uppercase tracking-[0.24em] text-slate-500 font-sans">
        (c) 2026 ALKAYA
      </div>
    </footer>
  );
}



