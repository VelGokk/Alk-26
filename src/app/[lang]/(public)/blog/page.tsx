import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export default async function BlogPage({ params }: { params: { lang: string } }) {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Blog</p>
        <h1 className="font-heading text-3xl">Notas de producto</h1>
      </div>
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-600">
          Todavía no hay publicaciones. Cargá artículos desde el panel
          superadmin.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="glass-panel rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                {post.publishedAt
                  ? format(post.publishedAt, "dd MMM yyyy")
                  : "Draft"}
              </p>
              <h2 className="mt-2 font-heading text-2xl">{post.title}</h2>
              <p className="mt-3 text-sm text-zinc-600">{post.excerpt}</p>
              <Link
                href={`/${params.lang}/blog`}
                className="mt-4 inline-flex text-xs uppercase tracking-[0.2em] text-brass"
              >
                Leer nota
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
