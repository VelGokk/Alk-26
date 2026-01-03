import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { hasEnv } from "@/lib/env";

export const isMercadoPagoConfigured = hasEnv("MERCADOPAGO_ACCESS_TOKEN");

function getClient() {
  if (!isMercadoPagoConfigured) {
    throw new Error("Mercado Pago no configurado.");
  }
  return new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string,
  });
}

export async function createPreference(payload: {
  items: { title: string; quantity: number; unit_price: number }[];
  externalReference: string;
  notificationUrl?: string;
  backUrls?: {
    success?: string;
    pending?: string;
    failure?: string;
  };
}) {
  const preference = new Preference(getClient());
  return preference.create({
    body: {
      items: payload.items as any,
      external_reference: payload.externalReference,
      notification_url: payload.notificationUrl,
      back_urls: payload.backUrls,
    },
  });
}

export async function fetchPayment(id: string) {
  const payment = new Payment(getClient());
  return payment.get({ id });
}
