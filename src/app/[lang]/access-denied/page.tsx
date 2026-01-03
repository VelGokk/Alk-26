import Link from "next/link";

export default async function AccessDeniedPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Acceso denegado
        </p>
        <h1 className="font-heading text-3xl">No tenes permisos</h1>
      </div>
      <p className="text-sm text-zinc-600">
        Tu rol actual no permite acceder a esta seccion.
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

