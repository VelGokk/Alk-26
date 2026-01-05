export function hasEnv(key: string) {
  return Boolean(process.env[key] && process.env[key]?.length);
}

export function getEnv(key: string, fallback = "") {
  return process.env[key] ?? fallback;
}

export const OPTIONAL_ENV = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "MERCADOPAGO_ACCESS_TOKEN",
  "MERCADOPAGO_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "MUX_TOKEN_ID",
  "MUX_TOKEN_SECRET",
  "OPENAI_API_KEY"
];

export const CRITICAL_ENV = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL"
];
