import type { TenantConfig } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getTenantConfigForUser(userId?: string) {
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      organization: {
        include: { tenantConfig: true },
      },
    },
  });
  return user?.organization?.tenantConfig ?? null;
}

export function tenantCssVars(config?: TenantConfig) {
  if (!config) return {};
  const vars: Record<string, string> = {};
  if (config.primaryColor) vars["--brand-primary"] = config.primaryColor;
  if (config.secondaryColor) vars["--brand-secondary"] = config.secondaryColor;
  if (config.accentColor) vars["--brand-accent"] = config.accentColor;
  if (config.ctaGlowColor) vars["--cta"] = config.ctaGlowColor;
  if (config.panelRadiusSpecific !== undefined)
    vars["--panel-radius"] = `${config.panelRadiusSpecific}px`;
  if (config.panelBlurSpecific !== undefined)
    vars["--panel-blur"] = `${config.panelBlurSpecific}px`;
  return vars;
}
