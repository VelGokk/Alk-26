import { prisma } from "./prisma";

export const DEFAULT_BRANDING = {
  logoUrl: "",
  primaryColor: "#0A2A43",
  secondaryColor: "#F5F7FA",
  accentColor: "#0D6EFD",
};

export const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  maintenanceMessage: "Estamos realizando mejoras. Volve en unos minutos.",
};

export async function getBranding() {
  const branding = await prisma.brandingSetting.findFirst();
  return branding ?? DEFAULT_BRANDING;
}

export async function getSystemSettings() {
  const settings = await prisma.systemSetting.findFirst();
  return settings ?? DEFAULT_SETTINGS;
}

