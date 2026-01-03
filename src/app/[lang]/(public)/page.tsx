import Link from "next/link";
import { CourseStatus } from "@prisma/client";
import CourseCard from "@/components/public/CourseCard";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export default async function HomePage({
  params,
}: {
  params: { lang: AppLocale };
}) {
  const dictionary = await getDictionary(params.lang);
  const courses = await prisma.course.findMany({
    where: { status: CourseStatus.PUBLISHED },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.brand}
          </p>
          <h1 className="font-heading text-4xl leading-tight sm:text-5xl">
            {dictionary.hero.title}
          </h1>
          <p className="text-lg text-zinc-600">
            {dictionary.hero.subtitle}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href={`/${params.lang}/courses`}
              className="rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"
            >
              Explorar cursos
            </Link>
            <Link
              href={`/${params.lang}/pricing`}
              className="rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink"
            >
              Ver planes
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-4 text-sm text-zinc-600 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-heading text-ink">120+</p>
              <p>Lecciones premium</p>
            </div>
            <div>
              <p className="text-2xl font-heading text-ink">28</p>
              <p>Programas activos</p>
            </div>
            <div>
              <p className="text-2xl font-heading text-ink">97%</p>
              <p>Satisfaccion</p>
            </div>
            <div>
              <p className="text-2xl font-heading text-ink">24/7</p>
              <p>Soporte</p>
            </div>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6 shadow-glow">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Experience stack
            </p>
            <h2 className="font-heading text-2xl">
              Gestion integral para academias modernas
            </h2>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li>Dashboards por rol con visibilidad total.</li>
              <li>Pagos integrados con Mercado Pago.</li>
              <li>Seguimiento de progreso y certificados.</li>
              <li>Integraciones opcionales con Mux y Resend.</li>
            </ul>
            <div className="rounded-2xl border border-dashed border-black/10 p-4 text-xs uppercase tracking-[0.3em] text-zinc-500">
              Disponible en {params.lang.toUpperCase()}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl">Cursos destacados</h2>
          <Link
            href={`/${params.lang}/courses`}
            className="text-xs uppercase tracking-[0.2em] text-brass"
          >
            Ver catalogo
          </Link>
        </div>
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-600">
            Todavia no hay cursos publicados. Carga el primero desde el panel
            de instructor.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} lang={params.lang} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

