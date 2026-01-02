import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "ARS 24.000",
    description: "Para equipos chicos con foco en contenido base.",
    features: ["3 cursos activos", "Soporte estándar", "Reportes básicos"],
  },
  {
    name: "Pro",
    price: "ARS 72.000",
    description: "La suite completa para academias en crecimiento.",
    features: [
      "Cursos ilimitados",
      "Roles avanzados",
      "Automatizaciones de email",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Integraciones a medida y soporte dedicado.",
    features: ["SLA", "Integraciones custom", "Onboarding premium"],
  },
];

export default function PricingPage({ params }: { params: { lang: string } }) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Pricing
        </p>
        <h1 className="font-heading text-3xl">Planes flexibles</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="glass-panel rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {plan.name}
            </p>
            <h2 className="mt-2 font-heading text-2xl">{plan.price}</h2>
            <p className="mt-3 text-sm text-zinc-600">{plan.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Link
              href={`/${params.lang}/checkout`}
              className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
            >
              Ir a checkout
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
