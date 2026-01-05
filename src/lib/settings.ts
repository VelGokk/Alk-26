import { prisma } from "./prisma";

export const DEFAULT_BRANDING = {
  logoUrl: "",
  primaryColor: "#0A2A43",
  secondaryColor: "#F5F7FA",
  accentColor: "#0D6EFD",
  panelRadius: 24,
  panelBlur: 16,
};

export const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  maintenanceMessage: "Estamos realizando mejoras. Volve en unos minutos.",
};

export async function getBranding() {
  try {
    const branding = await prisma.brandingSetting.findFirst();
    return branding ?? DEFAULT_BRANDING;
  } catch (err) {
    console.error("getBranding: unable to reach database, returning default branding", err);
    return DEFAULT_BRANDING;
  }
}

export async function getSystemSettings() {
  try {
    const settings = await prisma.systemSetting.findFirst();
    return settings ?? DEFAULT_SETTINGS;
  } catch (err) {
    console.error("getSystemSettings: unable to reach database, returning default settings", err);
    return DEFAULT_SETTINGS;
  }
}

