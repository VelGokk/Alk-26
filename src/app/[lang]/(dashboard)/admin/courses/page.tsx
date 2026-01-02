import { prisma } from "@/lib/prisma";
import { updateCourseStatus } from "@/lib/actions/admin";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: { instructor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Cursos
        </p>
        <h1 className="font-heading text-3xl">Gestión de contenidos</h1>
      </div>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="glass-panel rounded-2xl p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-heading text-xl">{course.title}</p>
                <p className="text-sm text-zinc-600">
                  {course.instructor?.name ?? course.instructor?.email}
                </p>
              </div>
              <form action={updateCourseStatus} className="flex items-center gap-2">
                <input type="hidden" name="courseId" value={course.id} />
                <select
                  name="status"
                  defaultValue={course.status}
                  className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.2em]"
                >
                  {["DRAFT", "IN_REVIEW", "PUBLISHED", "REJECTED", "ARCHIVED"].map(
                    (status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    )
                  )}
                </select>
                <button
                  type="submit"
                  className="rounded-full border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.2em]"
                >
                  Guardar
                </button>
              </form>
            </div>
            <p className="mt-2 text-sm text-zinc-600">{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
