import Link from "next/link";
import type { AppLocale } from "@/lib/i18n";

const programs = [
  {
    title: "Observador en accion",
    duration: "8 semanas",
    format: "Online en vivo + practica guiada",
    focus:
      "Para personas que quieren revisar su forma de observar y decidir en el trabajo y la vida.",
  },
  {
    title: "Liderazgo conversacional",
    duration: "10 semanas",
    format: "Cohorte para lideres y managers",
    focus:
      "Entrena conversaciones dificiles, coordinacion y feedback con impacto real.",
  },
  {
    title: "Equipos que coordinan",
    duration: "6 semanas",
    format: "Proceso in-company",
    focus:
      "Disenado para equipos que necesitan alineacion, confianza y acuerdos sostenibles.",
  },
  {
    title: "Cultura que sostiene",
    duration: "A medida",
    format: "Intervencion organizacional",
    focus:
      "Procesos de cambio cultural con acompanamiento y medicion por etapas.",
  },
];

export default function ProgramasPage({
  params,
}: {
  params: Promise<{ lang: AppLocale }>;
}) {
  return (
    <div className="space-y-16">
      <section className="space-y-6 animate-fade-up">
        <p className="eyebrow">Programas activos</p>
        <h1 className="font-heading text-4xl text-deep sm:text-5xl">
          Formacion continua, no cursos aislados
        </h1>
        <p className="subtitle">
          Cada programa incluye acompanamiento, practica y seguimiento para
          convertir el aprendizaje en accion sostenida.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {programs.map((program) => (
          <div key={program.title} className="card card-hover">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500 font-sans">
              <span>{program.duration}</span>
              <span className="text-slate-300">/</span>
              <span>{program.format}</span>
            </div>
            <h2 className="mt-4 font-heading text-2xl text-deep">
              {program.title}
            </h2>
            <p className="mt-3 text-sm text-slate-600">{program.focus}</p>
            <Link
              href={`/${params.lang}/contacto?tipo=formacion`}
              className="btn-ghost mt-6"
            >
              Quiero participar
            </Link>
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-deep p-10 text-white shadow-glow sm:p-12">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-alkaya/30 blur-3xl animate-float" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="eyebrow text-white/70">Cohortes 2026</p>
            <h2 className="font-heading text-3xl">
              Recibi el calendario actualizado
            </h2>
            <p className="text-sm text-white/80">
              Te contamos fechas, modalidad y requisitos segun tu contexto.
            </p>
          </div>
          <Link
            href={`/${params.lang}/contacto?tipo=formacion`}
            className="btn-primary"
          >
            Hablar con un asesor
          </Link>
        </div>
      </section>
    </div>
  );
}
