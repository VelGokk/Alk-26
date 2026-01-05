import Stripe from "stripe";
import { hasEnv } from "@/lib/env";

export const isStripeConfigured = hasEnv("STRIPE_SECRET_KEY");

let stripeClient: Stripe | null = null;

function getStripeClient() {
  if (stripeClient) {
    return stripeClient;
  }

  if (!isStripeConfigured) {
    throw new Error("Stripe no configurado.");
  }

  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-01-27.acacia",
  });

  return stripeClient;
}

export function getStripe() {
  return getStripeClient();
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET;
}

