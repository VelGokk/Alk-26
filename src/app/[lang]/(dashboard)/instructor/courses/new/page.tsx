import { createCourse } from "@/lib/actions/instructor";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function NewCoursePage() {
  await requireRole([Role.INSTRUCTOR, Role.SUPERADMIN]);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Nuevo curso
        </p>
        <h1 className="font-heading text-3xl">Crear curso</h1>
      </div>

      <form action={createCourse} className="glass-panel rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Título
          </label>
          <input
            name="title"
            required
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Descripción
          </label>
          <textarea
            name="description"
            required
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
            defaultValue={0}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
        >
          Crear curso
        </button>
      </form>
    </div>
  );
}
