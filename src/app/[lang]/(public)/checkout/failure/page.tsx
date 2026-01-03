import Link from "next/link";

export default function CheckoutFailure({ params }: { params: { lang: string } }) {
  return (
    <div className="space-y-6 text-center">
      <h1 className="font-heading text-3xl">Pago rechazado</h1>
      <p className="text-sm text-zinc-600">
        No pudimos procesar el pago. Intenta nuevamente o usa otro medio.
      </p>
      <Link
        href={`/${params.lang}/checkout`}
        className="inline-flex rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"
      >
        Reintentar
      </Link>
    </div>
  );
}

