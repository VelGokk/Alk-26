import Link from "next/link";
import type { AppLocale } from "@/lib/i18n";

const blocks = [
  {
    title: "Liderazgo & Cultura",
    description:
      "Alineamos conversaciones clave, acuerdos y coherencia entre lo que se dice y lo que se hace.",
  },
  {
    title: "Coaching de Equipos",
    description:
      "Entrenamos equipos para coordinar acciones, feedback y compromisos en contextos complejos.",
  },
  {
    title: "Gestion del Cambio",
    description:
      "Acompanamos cambios estructurales con intervenciones y metricas que sostienen el avance.",
  },
];

const signals = [
  "La organizacion entiende el cambio, pero no lo sostiene.",
  "Los equipos trabajan, pero no coordinan conversaciones dificiles.",
  "El liderazgo pide resultados sin un proceso claro de aprendizaje.",
];

export default function ConsultoriaPage({
  params,
}: {
  params: Promise<{ lang: AppLocale }>;
}) {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-white/80 p-8 shadow-soft sm:p-12 animate-fade-up">
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-alkaya/20 blur-3xl animate-glow" />
        <div className="relative space-y-6">
          <p className="eyebrow">Consultoria</p>
          <h1 className="font-heading text-4xl text-deep sm:text-5xl">
            Procesos de transformacion disenados desde coaching ontologico.
          </h1>
          <p className="subtitle">
            Disenamos intervenciones que impactan en como observas, decidis y
            coordinas. No es consultoria de cursos: es acompanamiento sostenido.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="pill">Diagnostico</span>
            <span className="pill">Diseno</span>
            <span className="pill">Intervencion</span>
            <span className="pill">Medicion</span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {blocks.map((block) => (
          <div key={block.title} className="card card-hover">
            <h2 className="font-heading text-2xl text-deep">{block.title}</h2>
            <p className="mt-3 text-sm text-slate-600">{block.description}</p>
            <Link
              href={`/${params.lang}/contacto?tipo=consultoria`}
              className="btn-ghost mt-6"
            >
              Quiero conversar esto
            </Link>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <p className="eyebrow">Senales tipicas</p>
          <h3 className="mt-3 font-heading text-2xl text-deep">
            Cuando conviene una intervencion ontologica
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {signals.map((signal) => (
              <li key={signal}>- {signal}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <p className="eyebrow">Primeros 30 dias</p>
          <h3 className="mt-3 font-heading text-2xl text-deep">
            Un proceso claro desde el inicio
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>- Entrevistas con lideres y mapeo de quiebres.</li>
            <li>- Diseno del proceso y acuerdos de trabajo.</li>
            <li>- Inicio de intervenciones con seguimiento semanal.</li>
            <li>- Plan de medicion y ajustes tempranos.</li>
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-deep p-10 text-white shadow-glow sm:p-12">
        <div className="absolute -right-6 top-6 h-32 w-32 rounded-full bg-alkaya/30 blur-3xl animate-float" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="eyebrow text-white/70">Siguiente paso</p>
            <h2 className="font-heading text-3xl">
              Hablemos sobre tu contexto
            </h2>
            <p className="text-sm text-white/80">
              Contanos donde esta el quiebre y disenamos un proceso a medida.
            </p>
          </div>
          <Link
            href={`/${params.lang}/contacto?tipo=consultoria`}
            className="btn-primary"
          >
            Quiero conversar esto
          </Link>
        </div>
      </section>
    </div>
  );
}
