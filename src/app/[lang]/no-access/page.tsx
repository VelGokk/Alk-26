import Link from "next/link";

export default async function NoAccessPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          No tenés acceso
        </p>
        <h1 className="font-heading text-3xl">Necesitás otro rol</h1>
      </div>
      <p className="text-sm text-zinc-600">
        Tu rol actual no tiene permisos para esa sección.
      </p>
      <Link
        href={`/${resolvedParams.lang}`}
        className="inline-flex rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
