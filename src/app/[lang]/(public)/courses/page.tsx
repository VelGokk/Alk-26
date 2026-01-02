import { CourseStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addToCart } from "@/lib/actions/cart";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function CoursesPage({
  params,
}: {
  params: { lang: string };
}) {
  const courses = await prisma.course.findMany({
    where: { status: CourseStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
  });
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Cursos
        </p>
        <h1 className="font-heading text-3xl">Catálogo completo</h1>
      </div>
      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-600">
          No hay cursos publicados todavía.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {courses.map((course) => (
            <div key={course.id} className="glass-panel rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl">{course.title}</h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    {course.description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-ink">
                    {formatCurrency(course.price, course.currency)}
                  </p>
                </div>
                <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-600">
                  {course.status}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {session?.user ? (
                  <form action={addToCart}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
                    >
                      Agregar al carrito
                    </button>
                  </form>
                ) : (
                  <Link
                    href={`/${params.lang}/auth`}
                    className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
                  >
                    Ingresar para comprar
                  </Link>
                )}
                <Link
                  href={`/${params.lang}/checkout`}
                  className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em]"
                >
                  Ir a checkout
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
