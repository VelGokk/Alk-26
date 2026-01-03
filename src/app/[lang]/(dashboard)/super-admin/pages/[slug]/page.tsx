import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { getPageContent } from "@/lib/pages";
import { addSection, updateSection, upsertPageMeta } from "@/lib/actions/pages";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale } from "@/lib/i18n";
import { Role } from "@prisma/client";

export default async function PageEditor({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  await requireRole([Role.SUPERADMIN]);
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const langParam = resolvedSearch?.lang;
  const targetLang = isLocale(langParam) ? langParam : DEFAULT_LOCALE;
  const page = await getPageContent({ slug: resolvedParams.slug, lang: targetLang });
  const sections = page?.sections ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          CMS
        </p>
        <h1 className="font-heading text-3xl">
          Editar pagina: {resolvedParams.slug}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
          {SUPPORTED_LOCALES.map((locale) => (
            <Link
              key={locale}
              href={`/${resolvedParams.lang}/super-admin/pages/${resolvedParams.slug}?lang=${locale}`}
              className={`rounded-full border px-3 py-1 ${
                locale === targetLang
                  ? "border-ink bg-ink text-white"
                  : "border-black/10 bg-white text-zinc-600"
              }`}
            >
              {locale}
            </Link>
          ))}
        </div>
      </div>

      <form
        action={upsertPageMeta}
        className="glass-panel rounded-2xl p-6 space-y-4"
      >
        <input type="hidden" name="slug" value={resolvedParams.slug} />
        <input type="hidden" name="lang" value={targetLang} />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              SEO title
            </label>
            <input
              name="seoTitle"
              defaultValue={page?.seoTitle ?? ""}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              SEO description
            </label>
            <textarea
              name="seoDesc"
              defaultValue={page?.seoDesc ?? ""}
              className="mt-2 h-24 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            name="action"
            value="save"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-600"
          >
            Guardar
          </button>
          <button
            type="submit"
            name="action"
            value="publish"
            className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
          >
            Guardar y publicar
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Secciones
        </p>
        {sections.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-sm text-zinc-500">
            No hay secciones creadas todavia.
          </div>
        ) : (
          sections.map((section) => (
            <form
              key={section.id}
              action={updateSection}
              className="glass-panel rounded-2xl p-6 space-y-4"
            >
              <input type="hidden" name="sectionId" value={section.id} />
              <input type="hidden" name="slug" value={resolvedParams.slug} />
              <input type="hidden" name="lang" value={targetLang} />
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Tipo
                  </label>
                  <input
                    name="type"
                    defaultValue={section.type}
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  <label className="flex items-center gap-2">
                    Orden
                    <input
                      name="order"
                      type="number"
                      defaultValue={section.order}
                      className="w-20 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="enabled"
                      defaultChecked={section.enabled}
                    />
                    Activa
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Data JSON
                </label>
                <textarea
                  name="data"
                  defaultValue={JSON.stringify(section.data, null, 2)}
                  className="mt-2 h-48 w-full rounded-xl border border-black/10 bg-white px-4 py-2 font-mono text-xs"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  name="action"
                  value="save"
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-600"
                >
                  Guardar
                </button>
                <button
                  type="submit"
                  name="action"
                  value="publish"
                  className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
                >
                  Guardar y publicar
                </button>
              </div>
            </form>
          ))
        )}
      </div>

      <form
        action={addSection}
        className="glass-panel rounded-2xl p-6 space-y-4"
      >
        <input type="hidden" name="slug" value={resolvedParams.slug} />
        <input type="hidden" name="lang" value={targetLang} />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Nueva seccion
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Tipo
            </label>
            <input
              name="type"
              placeholder="hero, cards, steps, cta, contact_form"
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Orden
            </label>
            <input
              name="order"
              type="number"
              defaultValue={sections.length + 1}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
              <input type="checkbox" name="enabled" defaultChecked />
              Activa
            </label>
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Data JSON
          </label>
          <textarea
            name="data"
            placeholder='{"title": "Nueva seccion"}'
            className="mt-2 h-32 w-full rounded-xl border border-black/10 bg-white px-4 py-2 font-mono text-xs"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
        >
          Agregar seccion
        </button>
      </form>
    </div>
  );
}
