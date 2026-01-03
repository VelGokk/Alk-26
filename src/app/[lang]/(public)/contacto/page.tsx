import Link from "next/link";
import type { AppLocale } from "@/lib/i18n";

export default function ContactoPage({
  params,
  searchParams,
}: {
  params: { lang: AppLocale };
  searchParams?: { tipo?: string };
}) {
  const selectedTipo =
    searchParams?.tipo === "formacion" || searchParams?.tipo === "otro"
      ? searchParams.tipo
      : "consultoria";
  const sent = searchParams?.enviado === "1";

  return (
    <div className="space-y-16">
      <section className="space-y-6 animate-fade-up">
        <p className="eyebrow">Contacto</p>
        <h1 className="font-heading text-4xl text-deep sm:text-5xl">
          Listo para dejar de intentar cambiar y empezar a disenar?
        </h1>
        <p className="subtitle">
          Contanos tu contexto y conversemos sobre el proceso que puede sostener
          el cambio.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          className="card space-y-6"
          action="/api/contacto"
          method="post"
        >
          <input type="hidden" name="lang" value={params.lang} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 font-sans">
                Nombre
              </label>
              <input
                name="nombre"
                required
                className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-deep outline-none transition focus:border-alkaya focus:ring-2 focus:ring-alkaya/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 font-sans">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-deep outline-none transition focus:border-alkaya focus:ring-2 focus:ring-alkaya/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 font-sans">
              Tipo de consulta
            </label>
            <select
              name="tipo"
              className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-deep outline-none transition focus:border-alkaya focus:ring-2 focus:ring-alkaya/20"
              defaultValue={selectedTipo}
            >
              <option value="consultoria">Consultoria</option>
              <option value="formacion">Formacion</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 font-sans">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              rows={5}
              className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-deep outline-none transition focus:border-alkaya focus:ring-2 focus:ring-alkaya/20"
            />
          </div>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Iniciar conversacion
          </button>
        </form>

        <div className="space-y-6">
          {sent ? (
            <div className="card border-emerald-500/40 bg-emerald-50/60">
              <p className="eyebrow text-emerald-700">Mensaje enviado</p>
              <p className="mt-2 text-sm text-emerald-700">
                Gracias por escribirnos. Te respondemos en breve.
              </p>
            </div>
          ) : null}
          <div className="card">
            <p className="eyebrow">Contacto directo</p>
            <h2 className="mt-3 font-heading text-2xl text-deep">
              Hablemos con claridad
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Respondemos en 24/48 hs habiles. Si tu consulta es urgente,
              escribinos directo.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>hola@alkaya.com</p>
              <p>+54 11 5555-5555</p>
              <p>Buenos Aires - CDMX - Remoto</p>
            </div>
          </div>
          <div className="card">
            <p className="eyebrow">Acceso privado</p>
            <h3 className="mt-3 font-heading text-2xl text-deep">
              Ya tenes login?
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Ingresa al dashboard para seguir tu proceso si ya sos cliente.
            </p>
            <Link
              href={`/${params.lang}/auth`}
              className="btn-ghost mt-6"
            >
              Ir al acceso privado
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
