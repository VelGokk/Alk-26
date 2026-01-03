import Link from "next/link";

export default function CheckoutSuccess({ params }: { params: { lang: string } }) {
  return (
    <div className="space-y-6 text-center">
      <h1 className="font-heading text-3xl">Pago aprobado</h1>
      <p className="text-sm text-zinc-600">
        Tu compra fue confirmada. Ya podes acceder a tus cursos.
      </p>
      <Link
        href={`/${params.lang}/app/my-courses`}
        className="inline-flex rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"
      >
        Ir a mis cursos
      </Link>
    </div>
  );
}

