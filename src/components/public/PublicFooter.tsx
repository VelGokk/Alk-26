import Link from "next/link";

export default function PublicFooter({ lang }: { lang: string }) {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white/60">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-heading text-xl">ALKAYA</p>
          <p className="mt-2 text-sm text-zinc-600">
            Plataforma LMS premium con foco en resultados y trazabilidad.
          </p>
        </div>
        <div className="text-sm text-zinc-600">
          <p className="font-semibold text-zinc-800">Explorar</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={`/${lang}/courses`}>Cursos</Link>
            </li>
            <li>
              <Link href={`/${lang}/resources`}>Recursos</Link>
            </li>
            <li>
              <Link href={`/${lang}/pricing`}>Planes</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm text-zinc-600">
          <p className="font-semibold text-zinc-800">Contacto</p>
          <ul className="mt-3 space-y-2">
            <li>soporte@alkaya.ai</li>
            <li>+54 11 5555-5555</li>
            <li>Buenos Aires - CDMX - Remote</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/10 px-4 py-4 text-center text-xs uppercase tracking-[0.2em] text-zinc-500">
        (c) 2026 ALKAYA LMS
      </div>
    </footer>
  );
}



