import { prisma } from "@/lib/prisma";

export default async function ResourcesPage() {
  const resources = await prisma.publicResource.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Recursos
        </p>
        <h1 className="font-heading text-3xl">Biblioteca ALKAYA</h1>
      </div>
      {resources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-600">
          Próximamente publicaremos recursos descargables.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {resources.map((resource) => (
            <div key={resource.id} className="glass-panel rounded-2xl p-6">
              <h2 className="font-heading text-xl">{resource.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">
                {resource.description}
              </p>
              <a
                href={resource.url}
                className="mt-4 inline-flex text-xs uppercase tracking-[0.2em] text-brass"
                target="_blank"
                rel="noreferrer"
              >
                Descargar
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
