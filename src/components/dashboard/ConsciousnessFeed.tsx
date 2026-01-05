import type { ShareLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface FeedItem {
  id: string;
  snippet: string;
  createdAt: Date;
  anonymous: boolean;
}

export default async function ConsciousnessFeed({
  organizationId,
}: {
  organizationId?: string;
}) {
  if (!organizationId) return null;
  const posts = await prisma.insightPost.findMany({
    where: {
      organizationId,
      status: "APPROVED",
      shareLevel: { not: ShareLevel.PRIVATE },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      isAnonymous: true,
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (posts.length === 0) return null;

  return (
    <section className="glass-panel rounded-2xl border border-black/10 p-6 mt-6 space-y-4 max-w-2xl">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          Feed de Consciencia
        </p>
        <h3 className="font-heading text-lg text-ink">
          Resonancias compartidas
        </h3>
        <p className="text-sm text-zinc-600">
          Insights anónimos aprobados por el equipo para acompañar la práctica.
        </p>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-black/5 bg-white/80 p-4 text-sm text-zinc-700"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {post.anonymous ? "Anónimo" : "Colega"}
            </p>
            <p className="mt-1 leading-relaxed">{post.content}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
              {new Date(post.createdAt).toLocaleString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
              })}
            </p>
          </article>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-zinc-500">
        <span>Resonar</span>
        <div className="relative">
          <span className="inline-block h-2 w-2 rounded-full bg-brand-primary" />
          <span className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 animate-ping rounded-full border border-brand-primary/30" />
        </div>
      </div>
    </section>
  );
}
