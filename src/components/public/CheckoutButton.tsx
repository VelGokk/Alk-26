"use client";

import { useState } from "react";
import dictionary from "@/config/dictionaries/es.json";

export default function CheckoutButton({ disabled }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const checkout = dictionary.checkout;

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
      alert(data?.error ?? checkout.errorInit);
    } catch (error) {
      console.error(error);
      alert(checkout.errorStart);
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
      {loading ? checkout.loading : checkout.pay}
    </button>
  );
}
