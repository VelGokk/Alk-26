import Link from "next/link";

export default function AccessDeniedPage({ params }: { params: { lang: string } }) {
  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Acceso denegado
        </p>
        <h1 className="font-heading text-3xl">No tenés permisos</h1>
      </div>
      <p className="text-sm text-zinc-600">
        Tu rol actual no permite acceder a esta sección.
      </p>
      <Link
        href={`/${params.lang}`}
        className="inline-flex rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
