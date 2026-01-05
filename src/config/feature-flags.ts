export type BrandingDefaults = {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

export const DEFAULT_BRANDING: BrandingDefaults = {
  logoUrl: "",
  primaryColor: "#0A2A43",
  secondaryColor: "#F5F7FA",
  accentColor: "#0D6EFD",
};

export type SystemSettingsDefaults = {
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

export const DEFAULT_SETTINGS: SystemSettingsDefaults = {
  maintenanceMode: false,
  maintenanceMessage: "Estamos realizando mejoras. Volve en unos minutos.",
};

export type IntegrationProvider = {
  id: string;
  env: readonly string[];
};

export const INTEGRATION_PROVIDERS = [
  { id: "MercadoPago", env: ["MERCADOPAGO_ACCESS_TOKEN"] },
  { id: "Resend", env: ["RESEND_API_KEY"] },
  { id: "Cloudinary", env: ["CLOUDINARY_CLOUD_NAME"] },
  { id: "Mux", env: ["MUX_TOKEN_ID"] },
  { id: "OpenAI", env: ["OPENAI_API_KEY"] },
] satisfies IntegrationProvider[];

export const OPTIONAL_ENV = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "MERCADOPAGO_ACCESS_TOKEN",
  "MERCADOPAGO_WEBHOOK_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "MUX_TOKEN_ID",
  "MUX_TOKEN_SECRET",
  "OPENAI_API_KEY",
] as const;

export const CRITICAL_ENV = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
] as const;

export type PlatformFeatureFlags = {
  motion: boolean;
  cursorDot: boolean;
  flowGlow: boolean;
  multiTenant: boolean;
  legalEditor: boolean;
  feedInsights: boolean;
  integrations: boolean;
  liveSessions: boolean;
};

export const DEFAULT_FEATURE_FLAGS: PlatformFeatureFlags = {
  motion: false,
  cursorDot: false,
  flowGlow: false,
  multiTenant: false,
  legalEditor: false,
  feedInsights: false,
  integrations: false,
  liveSessions: false,
};

const parseFlag = (key: string, fallback: boolean) => {
  const raw = process.env[key];
  if (raw === undefined) return fallback;
  return ["1", "true", "enabled"].includes(raw.toLowerCase());
};

export function getFeatureFlags(): PlatformFeatureFlags {
  return {
    motion: parseFlag("FEATURE_FLAG_MOTION", DEFAULT_FEATURE_FLAGS.motion),
    cursorDot: parseFlag("FEATURE_FLAG_CURSOR_DOT", DEFAULT_FEATURE_FLAGS.cursorDot),
    flowGlow: parseFlag("FEATURE_FLAG_FLOW_GLOW", DEFAULT_FEATURE_FLAGS.flowGlow),
    multiTenant: parseFlag(
      "FEATURE_FLAG_MULTI_TENANT",
      DEFAULT_FEATURE_FLAGS.multiTenant
    ),
    legalEditor: parseFlag(
      "FEATURE_FLAG_LEGAL_EDITOR",
      DEFAULT_FEATURE_FLAGS.legalEditor
    ),
    feedInsights: parseFlag(
      "FEATURE_FLAG_FEED_INSIGHTS",
      DEFAULT_FEATURE_FLAGS.feedInsights
    ),
    integrations: parseFlag(
      "FEATURE_FLAG_INTEGRATIONS",
      DEFAULT_FEATURE_FLAGS.integrations
    ),
    liveSessions: parseFlag(
      "FEATURE_FLAG_LIVE_SESSIONS",
      DEFAULT_FEATURE_FLAGS.liveSessions
    ),
  };
}
