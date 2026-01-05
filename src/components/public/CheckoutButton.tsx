"use client";

import { useState } from "react";
import dictionary from "@/config/dictionaries/es.json";
import { Button } from "@/components/ui/button";

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
    <Button
      type="button"
      size="default"
      variant="default"
      disabled={disabled || loading}
      onClick={handleCheckout}
    >
      {loading ? checkout.loading : checkout.pay}
    </Button>
  );
}
