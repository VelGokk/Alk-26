import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import CheckoutButton from "@/components/public/CheckoutButton";

export default async function CheckoutPage({ params }: { params: { lang: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${params.lang}/auth`);
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { course: true } } },
  });

  const total = cart?.items.reduce((sum, item) => sum + item.course.price, 0) ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Checkout
        </p>
        <h1 className="font-heading text-3xl">Confirmar compra</h1>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-600">
          Tu carrito está vacío. Volvé al catálogo y agregá cursos.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="glass-panel flex items-center justify-between rounded-2xl p-4"
              >
                <div>
                  <p className="font-heading text-lg">{item.course.title}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {item.course.status}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {formatCurrency(item.course.price, item.course.currency)}
                </span>
              </div>
            ))}
          </div>
          <div className="glass-panel space-y-4 rounded-2xl p-6">
            <div className="flex items-center justify-between text-sm">
              <span>Total</span>
              <span className="font-semibold">
                {formatCurrency(total, "ARS")}
              </span>
            </div>
            <CheckoutButton />
            <p className="text-xs text-zinc-500">
              El pago se procesa vía Mercado Pago. Si no está configurado,
              recibirás un aviso.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
