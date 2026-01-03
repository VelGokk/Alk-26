import Link from "next/link";

export default function CheckoutPending({ params }: { params: { lang: string } }) {
  return (
    <div className="space-y-6 text-center">
      <h1 className="font-heading text-3xl">Pago pendiente</h1>
      <p className="text-sm text-zinc-600">
        El pago quedo pendiente. Te avisaremos cuando se confirme.
      </p>
      <Link
        href={`/${params.lang}/app/my-courses`}
        className="inline-flex rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.2em]"
      >
        Ver mis cursos
      </Link>
    </div>
  );
}
