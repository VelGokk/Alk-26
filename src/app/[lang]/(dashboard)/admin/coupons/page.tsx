import { prisma } from "@/lib/prisma";
import { createCoupon, deleteCoupon } from "@/lib/actions/admin";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function AdminCouponsPage() {
  await requireRole([Role.ADMIN, Role.SUPERADMIN]);
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Cupones
        </p>
        <h1 className="font-heading text-3xl">Promociones</h1>
      </div>

      <form action={createCoupon} className="glass-panel rounded-2xl p-6 space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            name="code"
            placeholder="CODIGO"
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
          <input
            name="amount"
            type="number"
            placeholder="Monto"
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
          <select
            name="type"
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          >
            <option value="PERCENT">%</option>
            <option value="FIXED">ARS</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
        >
          Crear cupon
        </button>
      </form>

      <div className="space-y-3">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="glass-panel rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading text-lg">{coupon.code}</p>
                <p className="text-sm text-zinc-600">
                  {coupon.type} - {coupon.amount}
                </p>
              </div>
              <form action={deleteCoupon}>
                <input type="hidden" name="id" value={coupon.id} />
                <button
                  type="submit"
                  className="rounded-full border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.2em]"
                >
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

