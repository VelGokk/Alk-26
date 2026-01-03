import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { submitForReview } from "@/lib/actions/instructor";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function InstructorCoursesPage({
  params,
}: {
  params: { lang: string };
}) {
  await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const session = await getServerSession(authOptions);
  const courses = await prisma.course.findMany({
    where: { instructorId: session?.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Cursos
          </p>
          <h1 className="font-heading text-3xl">Mis cursos</h1>
        </div>
        <Link
          href={`/${params.lang}/instructor/courses/new`}
          className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
        >
          Nuevo curso
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-600">
          Todavia no creaste cursos.
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="glass-panel rounded-2xl p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-heading text-xl">{course.title}</p>
                  <p className="text-sm text-zinc-600">{course.description}</p>
                </div>
                <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                  {course.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/${params.lang}/instructor/courses/${course.id}/edit`}
                  className="rounded-full border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.2em]"
                >
                  Editar
                </Link>
                <Link
                  href={`/${params.lang}/instructor/courses/${course.id}/modules`}
                  className="rounded-full border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.2em]"
                >
                  Modulos
                </Link>
                {course.status === "DRAFT" ? (
                  <form action={submitForReview}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-ink px-3 py-2 text-xs uppercase tracking-[0.2em] text-white"
                    >
                      Enviar a revision
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
