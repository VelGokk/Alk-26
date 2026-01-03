import Link from "next/link";
import type { AppLocale } from "@/lib/i18n";

const team = [
  {
    name: "Camila V.",
    role: "Directora de Transformacion",
    focus: "Procesos culturales y liderazgo conversacional.",
  },
  {
    name: "Tomas G.",
    role: "Consultor Ontologico",
    focus: "Coaching de equipos y coordinacion de acciones.",
  },
  {
    name: "Elena R.",
    role: "Head de Formacion",
    focus: "Programas para lideres y acompanamiento individual.",
  },
  {
    name: "Diego P.",
    role: "Consultor Senior",
    focus: "Gestion del cambio y procesos sostenidos.",
  },
];

export default function NosotrosPage({
  params,
}: {
  params: Promise<{ lang: AppLocale }>;
}) {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-white/80 p-8 shadow-soft sm:p-12 animate-fade-up">
        <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-alkaya/20 blur-3xl animate-glow" />
        <div className="relative space-y-6">
          <p className="eyebrow">Nosotros</p>
          <h1 className="font-heading text-4xl text-deep sm:text-5xl">
            No somos una escuela. Somos una consultora de coaching ontologico
            que disena transformacion real.
          </h1>
          <p className="subtitle">
            Disenamos procesos sostenidos para lideres y organizaciones que
            quieren cambiar su forma de observar y decidir, sin promesas
            magicas.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card">
          <p className="eyebrow">Manifiesto Alkaya</p>
          <h2 className="mt-3 font-heading text-2xl text-deep">
            Cambiamos conversaciones, no personas
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Creemos en procesos que construyen coherencia entre lo que decimos y
            lo que hacemos. Observamos, intervenimos y acompanamos hasta que el
            cambio se vuelve practica.
          </p>
        </div>
        <div className="card">
          <p className="eyebrow">Como nacio Alkaya</p>
          <h2 className="mt-3 font-heading text-2xl text-deep">
            Desde la practica, no desde el discurso
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Nacimos trabajando con lideres que necesitaban sostener cambios
            reales. Vimos que entender no alcanza y creamos procesos con
            acompanamiento continuo.
          </p>
        </div>
        <div className="card">
          <p className="eyebrow">Enfoque ontologico</p>
          <h2 className="mt-3 font-heading text-2xl text-deep">
            Observacion, lenguaje y accion
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Trabajamos sobre el observador: como interpreta, conversa y decide.
            Ahi nace la transformacion sostenible.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl text-deep">Equipo</h2>
          <Link href={`/${params.lang}/contacto`} className="btn-ghost">
            Sumate a la conversacion
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="card card-hover">
              <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-100 text-xs uppercase tracking-[0.24em] text-slate-400">
                Foto real
              </div>
              <h3 className="mt-4 font-heading text-xl text-deep">
                {member.name}
              </h3>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                {member.role}
              </p>
              <p className="mt-3 text-sm text-slate-600">{member.focus}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-deep p-10 text-white shadow-glow sm:p-12">
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-alkaya/30 blur-3xl animate-float" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="eyebrow text-white/70">CTA</p>
            <h2 className="font-heading text-3xl">
              Hablemos de tu proceso de cambio
            </h2>
            <p className="text-sm text-white/80">
              Conversemos sobre el contexto y disenemos juntos el camino.
            </p>
          </div>
          <Link href={`/${params.lang}/contacto`} className="btn-primary">
            Hablar con un consultor
          </Link>
        </div>
      </section>
    </div>
  );
}
