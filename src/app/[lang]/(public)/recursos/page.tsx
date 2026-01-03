import Link from "next/link";
import type { AppLocale } from "@/lib/i18n";

const articles = [
  {
    title: "El observador y sus decisiones",
    summary:
      "Como los juicios y las emociones condicionan lo que elegis y lo que postergas.",
    tag: "Articulo",
  },
  {
    title: "Conversaciones que sostienen la cultura",
    summary:
      "Claves para pasar de acuerdos declarados a practicas que se cumplen.",
    tag: "Conversaciones",
  },
  {
    title: "Coordinacion en equipos complejos",
    summary:
      "Herramientas para coordinar acciones sin perder confianza ni claridad.",
    tag: "Equipos",
  },
];

const media = [
  {
    title: "Podcast: Cambiar sin promesas magicas",
    summary: "Una charla sobre procesos reales de transformacion.",
    tag: "Podcast",
  },
  {
    title: "Video: Liderazgo conversacional",
    summary: "Como liderar conversaciones dificiles en contextos de cambio.",
    tag: "Video",
  },
];

const downloads = [
  {
    title: "Guia de conversaciones clave",
    summary: "Preguntas y estructuras para conversaciones que abren camino.",
    tag: "Descargable",
  },
  {
    title: "Checklist de cambios sostenidos",
    summary: "Senales para medir si el cambio se vuelve practica.",
    tag: "Herramienta",
  },
];

export default function RecursosPage({
  params,
}: {
  params: { lang: AppLocale };
}) {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-white/80 p-8 shadow-soft sm:p-12 animate-fade-up">
        <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-alkaya/20 blur-3xl animate-glow" />
        <div className="relative space-y-6">
          <p className="eyebrow">Recursos</p>
          <h1 className="font-heading text-4xl text-deep sm:text-5xl">
            Ideas, herramientas y conversaciones para ampliar tu forma de
            observar.
          </h1>
          <p className="subtitle">
            Seleccion curada para lideres y organizaciones que buscan sostener
            el cambio en el tiempo.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="#articulos" className="btn-primary">
              Explorar recursos
            </Link>
            <Link href={`/${params.lang}/contacto`} className="btn-secondary">
              Recibir novedades
            </Link>
          </div>
        </div>
      </section>

      <section id="articulos" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl text-deep">Articulos</h2>
          <span className="pill">Lecturas</span>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((item) => (
            <div key={item.title} className="card card-hover">
              <p className="eyebrow">{item.tag}</p>
              <h3 className="mt-3 font-heading text-xl text-deep">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{item.summary}</p>
              <Link
                href={`/${params.lang}/contacto`}
                className="btn-ghost mt-6"
              >
                Pedir acceso
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="podcasts" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl text-deep">Podcasts / Videos</h2>
          <span className="pill">Conversaciones</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {media.map((item) => (
            <div key={item.title} className="card card-hover">
              <p className="eyebrow">{item.tag}</p>
              <h3 className="mt-3 font-heading text-xl text-deep">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{item.summary}</p>
              <Link
                href={`/${params.lang}/contacto`}
                className="btn-ghost mt-6"
              >
                Solicitar link
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="descargables" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl text-deep">Descargables</h2>
          <span className="pill">Herramientas</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {downloads.map((item) => (
            <div key={item.title} className="card card-hover">
              <p className="eyebrow">{item.tag}</p>
              <h3 className="mt-3 font-heading text-xl text-deep">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{item.summary}</p>
              <Link
                href={`/${params.lang}/contacto`}
                className="btn-ghost mt-6"
              >
                Recibir descargable
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
