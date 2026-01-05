import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { getPageContent } from "@/lib/pages";
import {
  addSection,
  duplicateSection,
  setPagePublication,
  reorderSection,
  updateSection,
  upsertPageMeta,
} from "@/lib/actions/pages";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale } from "@/lib/i18n";
import { Role } from "@prisma/client";
import { getPagePreviewPath } from "@/config/pages";
import { getSectionOptions, resolveSectionType } from "@/config/sections";

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
  const page = await getPageContent({
    slug: resolvedParams.slug,
    lang: targetLang,
    preview: true,
  });
  const sections = page?.sections ?? [];
  const isPublished = Boolean(page?.isPublished);
  const previewPath = getPagePreviewPath(resolvedParams.slug, targetLang);
  const sectionOptions = getSectionOptions();
  const defaultSectionType = sectionOptions[0]?.type ?? "cards";
  const defaultNewSectionData = JSON.stringify(
    sectionOptions[0]?.defaultData ?? {},
    null,
    2
  );

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

      <form
        action={setPagePublication}
        className="glass-panel rounded-2xl border border-black/10 bg-white p-4"
      >
        <input type="hidden" name="slug" value={resolvedParams.slug} />
        <input type="hidden" name="lang" value={targetLang} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Estado: {isPublished ? "Publicado" : "Borrador"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              name="action"
              value={isPublished ? "unpublish" : "publish"}
              className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
            >
              {isPublished ? "Despublicar" : "Publicar"}
            </button>
            <Link
              href={
                page?.previewToken
                  ? `${previewPath}?token=${page.previewToken}`
                  : previewPath
              }
              target="_blank"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-600"
            >
              Preview
            </Link>
            {page?.previewToken ? (
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Link secreto activo
              </span>
            ) : null}
          </div>
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
          sections.map((section) => {
            const sectionType = resolveSectionType(section.type);
            const sectionMeta = sectionOptions.find(
              (option) => option.type === sectionType
            );

            return (
              <div key={section.id} className="space-y-4">
                <form
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
                      <select
                        name="type"
                        defaultValue={section.type}
                        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
                      >
                        {sectionOptions.map((option) => (
                          <option key={option.type} value={option.type}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {sectionMeta ? (
                        <p className="mt-1 text-xs text-slate-400">
                          {sectionMeta.description}
                        </p>
                      ) : null}
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
                <div className="flex flex-wrap gap-2">
                  <form action={duplicateSection} className="inline">
                    <input type="hidden" name="sectionId" value={section.id} />
                    <input type="hidden" name="slug" value={resolvedParams.slug} />
                    <input type="hidden" name="lang" value={targetLang} />
                    <button
                      type="submit"
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-600"
                    >
                      Duplicar
                    </button>
                  </form>
                  <form action={reorderSection} className="inline">
                    <input type="hidden" name="sectionId" value={section.id} />
                    <input type="hidden" name="slug" value={resolvedParams.slug} />
                    <input type="hidden" name="lang" value={targetLang} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      className="rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600"
                    >
                      Subir
                    </button>
                  </form>
                  <form action={reorderSection} className="inline">
                    <input type="hidden" name="sectionId" value={section.id} />
                    <input type="hidden" name="slug" value={resolvedParams.slug} />
                    <input type="hidden" name="lang" value={targetLang} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      className="rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600"
                    >
                      Bajar
                    </button>
                  </form>
                </div>
              </div>
            );
          })
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
            <select
              name="type"
              defaultValue={defaultSectionType}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
            >
              {sectionOptions.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              {sectionOptions.find((option) => option.type === defaultSectionType)
                ?.description ?? ""}
            </p>
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
            defaultValue={defaultNewSectionData}
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
