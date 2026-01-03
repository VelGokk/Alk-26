import Link from "next/link";
import type { AppLocale } from "@/lib/i18n";

const programs = [
  {
    title: "Programas personales",
    description:
      "Procesos uno a uno para revisar la forma en que observas, decidis y sostienes compromisos.",
  },
  {
    title: "Programas para lideres",
    description:
      "Entrenamiento en conversaciones, coordinacion y liderazgo en contextos reales.",
  },
  {
    title: "Programas para equipos",
    description:
      "Intervenciones grupales para mejorar confianza, acuerdos y cultura de trabajo.",
  },
];

const principles = [
  "Formacion aplicada a tu contexto, no teorica.",
  "Acompanamiento entre encuentros para sostener el cambio.",
  "Metricas y reflexion para consolidar aprendizajes.",
];

export default function FormacionPage({
  params,
}: {
  params: { lang: AppLocale };
}) {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-white/80 p-8 shadow-soft sm:p-12 animate-fade-up">
        <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-alkaya/20 blur-3xl animate-glow" />
        <div className="relative space-y-6">
          <p className="eyebrow">Formacion</p>
          <h1 className="font-heading text-4xl text-deep sm:text-5xl">
            Formacion basada en coaching ontologico para transformar como
            observas, decidis y actuas.
          </h1>
          <p className="subtitle">
            No somos escuela. Disenamos procesos de aprendizaje insertos en tu
            realidad, con acompanamiento sostenido.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href={`/${params.lang}/formacion/programas`}
              className="btn-primary"
            >
              Ver programas activos
            </Link>
            <Link
              href={`/${params.lang}/contacto?tipo=formacion`}
              className="btn-secondary"
            >
              Hablar con un asesor
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {programs.map((program) => (
          <div key={program.title} className="card card-hover">
            <h2 className="font-heading text-2xl text-deep">
              {program.title}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              {program.description}
            </p>
            <Link
              href={`/${params.lang}/contacto?tipo=formacion`}
              className="btn-ghost mt-6"
            >
              Quiero saber mas
            </Link>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <p className="eyebrow">Principios</p>
          <h3 className="mt-3 font-heading text-2xl text-deep">
            Formacion que se vuelve practica
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {principles.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <p className="eyebrow">Acompanamiento</p>
          <h3 className="mt-3 font-heading text-2xl text-deep">
            Sostener el cambio, no solo entenderlo
          </h3>
          <p className="mt-4 text-sm text-slate-600">
            La formacion incluye seguimiento entre encuentros, guias de
            conversacion y espacios de retroalimentacion para mantener el
            compromiso vivo.
          </p>
          <Link
            href={`/${params.lang}/contacto?tipo=formacion`}
            className="btn-ghost mt-6"
          >
            Hablar con un asesor
          </Link>
        </div>
      </section>
    </div>
  );
}
