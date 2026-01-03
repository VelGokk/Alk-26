import Link from "next/link";
import { getDictionary, type AppLocale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: { lang: AppLocale };
}) {
  const dictionary = await getDictionary(params.lang);
  const highlights = [
    {
      label: "Consultoria Ontologica",
      description:
        "Intervenciones para transformar conversaciones, decisiones y cultura en tiempo real.",
    },
    {
      label: "Formacion Transformacional",
      description:
        "Programas que cambian la forma de observar, decidir y actuar, sin recetas magicas.",
    },
    {
      label: "Acompanamiento Sostenido",
      description:
        "Seguimiento, medicion y ajustes para que el cambio se sostenga en el tiempo.",
    },
  ];

  const steps = [
    {
      title: "Escucha y diagnostico",
      description:
        "Leemos el sistema actual, sus conversaciones y los quiebres que no se nombran.",
    },
    {
      title: "Diseno del proceso",
      description:
        "Co-creamos un mapa de intervencion con hitos, responsables y medicion.",
    },
    {
      title: "Intervencion y practica",
      description:
        "Entrenamos nuevas formas de observar y actuar con acompanamiento cercano.",
    },
    {
      title: "Medicion y ajuste",
      description:
        "Observamos resultados, ajustamos el proceso y consolidamos aprendizajes.",
    },
  ];

  const testimonials = [
    {
      quote:
        "No cambiamos la gente. Cambiamos las conversaciones y la forma de decidir.",
      name: "Martina R.",
      role: "Directora de RRHH, Industria",
    },
    {
      quote:
        "El proceso ordeno prioridades y dio lenguaje comun a equipos que no se escuchaban.",
      name: "Gustavo L.",
      role: "CEO, Servicios Profesionales",
    },
    {
      quote:
        "Lo valioso fue el seguimiento: sostener la practica cuando vuelve la urgencia.",
      name: "Lucia P.",
      role: "People Lead, Tecnologia",
    },
  ];

  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-white/80 p-8 shadow-soft sm:p-12 animate-fade-up">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-alkaya/20 blur-3xl animate-glow" />
        <div className="absolute -bottom-16 left-6 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl animate-glow" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="eyebrow">{dictionary.brand}</p>
            <h1 className="font-heading text-4xl leading-tight text-deep sm:text-5xl">
              {dictionary.hero.title}
            </h1>
            <p className="subtitle">{dictionary.hero.subtitle}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href={`/${params.lang}/consultoria`} className="btn-primary">
                Quiero ordenar mi proceso
              </Link>
              <Link href={`/${params.lang}/formacion`} className="btn-secondary">
                Quiero formarme
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4 text-sm text-slate-600 sm:grid-cols-4">
              <div>
                <p className="font-heading text-2xl text-deep">+12</p>
                <p>Procesos 2025/26</p>
              </div>
              <div>
                <p className="font-heading text-2xl text-deep">3</p>
                <p>Formatos de intervencion</p>
              </div>
              <div>
                <p className="font-heading text-2xl text-deep">92%</p>
                <p>Continuidad a 6 meses</p>
              </div>
              <div>
                <p className="font-heading text-2xl text-deep">1:1</p>
                <p>Seguimiento humano</p>
              </div>
            </div>
          </div>
          <div className="card card-hover space-y-5">
            <div>
              <p className="eyebrow">Mapa de transformacion</p>
              <h2 className="mt-3 font-heading text-2xl text-deep">
                Del diagnostico a la practica diaria
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>Observamos quiebres, conversaciones y contextos.</li>
              <li>Disenamos intervenciones y metricas de avance.</li>
              <li>Acompanamos lideres, equipos y personas clave.</li>
              <li>Medimos impacto y ajustamos el sistema.</li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <span className="pill">Diagnostico</span>
              <span className="pill">Diseno</span>
              <span className="pill">Intervencion</span>
              <span className="pill">Seguimiento</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Que hacemos</p>
          <h2 className="font-heading text-3xl text-deep">
            Procesos de transformacion, no cursos sueltos
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.label} className="card card-hover">
              <p className="eyebrow">ALKAYA</p>
              <h3 className="mt-4 font-heading text-2xl text-deep">
                {item.label}
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                {item.description}
              </p>
              <Link
                href={`/${params.lang}/contacto`}
                className="btn-ghost mt-6"
              >
                Hablemos
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Como trabajamos</p>
          <h2 className="font-heading text-3xl text-deep">
            Un proceso claro con acompanamiento sostenido
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {steps.map((step, index) => (
            <div key={step.title} className="card card-hover">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-alkaya/10 text-sm font-semibold text-alkaya">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="font-heading text-xl text-deep">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p className="eyebrow">Casos reales</p>
            <h2 className="font-heading text-3xl text-deep">
              Testimonios que hablan de proceso
            </h2>
          </div>
          <Link href={`/${params.lang}/recursos`} className="btn-ghost">
            Ver recursos
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="card card-hover">
              <p className="text-sm text-slate-600">"{item.quote}"</p>
              <div className="mt-6">
                <p className="font-heading text-lg text-deep">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  {item.role}
                </p>
              </div>
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
              Listo para disenar un proceso que se sostenga
            </h2>
            <p className="text-sm text-white/80">
              Hablemos sobre tu contexto y lo que hoy no esta ocurriendo.
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

