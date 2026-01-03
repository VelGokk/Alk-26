import { prisma } from "@/lib/prisma";
import { updateCourse } from "@/lib/actions/instructor";
import UploadField from "@/components/public/UploadField";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function EditCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
  });

  if (!course) {
    return <div className="text-sm text-zinc-600">Curso no encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Editar curso
        </p>
        <h1 className="font-heading text-3xl">{course.title}</h1>
      </div>

      <form action={updateCourse} className="glass-panel rounded-2xl p-6 space-y-4">
        <input type="hidden" name="courseId" value={course.id} />
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Titulo
          </label>
          <input
            name="title"
            defaultValue={course.title}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Descripcion
          </label>
          <textarea
            name="description"
            defaultValue={course.description}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Precio (ARS)
          </label>
          <input
            name="price"
            type="number"
            defaultValue={course.price}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
        </div>
        <UploadField
          name="thumbnailUrl"
          label="Thumbnail"
          defaultValue={course.thumbnailUrl}
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
