import { prisma } from "./prisma";

export const DEFAULT_BRANDING = {
  logoUrl: "",
  primaryColor: "#0B0D0E",
  secondaryColor: "#F5F1E8",
  accentColor: "#8C6C3F",
};

export const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  maintenanceMessage: "Estamos realizando mejoras. Volv√(c) en unos minutos.",
};

export async function getBranding() {
  const branding = await prisma.brandingSetting.findFirst();
  return branding ?? DEFAULT_BRANDING;
}

export async function getSystemSettings() {
  const settings = await prisma.systemSetting.findFirst();
  return settings ?? DEFAULT_SETTINGS;
}

