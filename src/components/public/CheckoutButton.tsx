"use client";

import { useState } from "react";

export default function CheckoutButton({ disabled }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/mercadopago/create-preference", {
        method: "POST",
      });
      const data = await res.json();
      if (data?.initPoint) {
        window.location.href = data.initPoint as string;
        return;
      }
      alert(data?.error ?? "No se pudo iniciar el checkout.");
    } catch (error) {
      console.error(error);
      alert("Error al iniciar el pago.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={handleCheckout}
      className="rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white disabled:opacity-50"
    >
      {loading ? "Procesando..." : "Pagar con Mercado Pago"}
    </button>
  );
}
