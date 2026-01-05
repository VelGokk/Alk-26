import { Role } from "@prisma/client";
import { createTranslator, getDictionary, isLocale, type AppLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { DEFAULT_LOCALE } from "@/config/i18n";
import Link from "next/link";

type SearchParams = {
  q?: string | string[];
};

export default async function LegalAuditPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: SearchParams;
}) {
  const resolvedParams = await params;
  const resolvedLang = isLocale(resolvedParams.lang)
    ? resolvedParams.lang
    : DEFAULT_LOCALE;
  await requireRole([Role.SUPERADMIN]);

  const rawQuery =
    Array.isArray(searchParams?.q) && searchParams.q.length > 0
      ? searchParams.q[0]
      : searchParams?.q;
  const query = (rawQuery ?? "").trim();

  const filter = query
    ? {
        OR: [
          { user: { name: { contains: query, mode: "insensitive" } } },
          { user: { email: { contains: query, mode: "insensitive" } } },
        ],
      }
    : {};

  const signatures = await prisma.legalSignature.findMany({
    where: filter,
    include: {
      user: true,
      legalDocument: true,
    },
    orderBy: { signedAt: "desc" },
    take: 50,
  });

  const dictionary = await getDictionary(resolvedLang);
  const translate = createTranslator(dictionary);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {translate("dashboard.legalAudit")}
        </p>
        <h1 className="font-heading text-3xl text-ink">
          {translate("dashboard.legalAuditTitle")}
        </h1>
        <p className="text-sm text-slate-600">
          {translate("dashboard.legalAuditDescription")}
        </p>
      </div>
      <form method="get" className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="legal-audit-search">
          {translate("dashboard.legalAuditSearchPlaceholder")}
        </label>
        <input
          id="legal-audit-search"
          name="q"
          defaultValue={query}
          placeholder={translate("dashboard.legalAuditSearchPlaceholder")}
          className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-2xl border border-ink bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black/90"
        >
          {translate("dashboard.legalAuditSearchButton")}
        </button>
      </form>
      {signatures.length === 0 ? (
        <div className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-slate-600">
          {translate("dashboard.legalAuditEmpty")}
        </div>
      ) : (
        <div className="grid gap-4">
          {signatures.map((signature) => (
            <article
              key={signature.id}
              className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-soft"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-ink">
                    {signature.user.name ?? signature.user.email ?? "Usuario"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {signature.user.email}
                  </p>
                </div>
                <Link
                  href={`/api/legal/certificate?signatureId=${signature.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink transition hover:bg-ink hover:text-white"
                >
                  {translate("dashboard.legalAuditDownload")}
                </Link>
              </div>
              <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-3">
                <p>
                  {translate("dashboard.legalAuditVersion")}{" "}
                  {signature.versionNumber}
                </p>
                <p>
                  {translate("dashboard.legalAuditSignedAt")}{" "}
                  {new Date(signature.signedAt).toLocaleString(resolvedLang)}
                </p>
                <p>
                  {translate("dashboard.legalAuditIpLabel")}{" "}
                  {signature.ip ?? "—"}
                </p>
                <p className="sm:col-span-3 break-words">
                  {translate("dashboard.legalAuditUserAgent")}{" "}
                  {signature.userAgent ?? "—"}
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-dashed border-black/20 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {translate("dashboard.legalAuditTextLabel")}
                </p>
                <div
                  className="space-y-3"
                  dangerouslySetInnerHTML={{
                    __html: signature.legalDocument?.content ?? "",
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
