"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { logEvent } from "@/lib/logger";

export async function updateUserRole(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!userId || !role) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as Role },
  });

  await logEvent({
    action: "user.role.update",
    message: `Rol actualizado ${userId} -> ${role}`,
  });

  revalidatePath("/super-admin/users");
}

export async function toggleUserActive(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  await logEvent({
    action: "user.active.toggle",
    message: `Usuario ${user.email} activo=${!user.isActive}`,
  });

  revalidatePath("/super-admin/users");
}

export async function updateIntegration(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const provider = String(formData.get("provider") ?? "");
  const isEnabled = Boolean(formData.get("isEnabled"));
  const publicKey = String(formData.get("publicKey") ?? "");
  const webhookUrl = String(formData.get("webhookUrl") ?? "");
  const notes = String(formData.get("notes") ?? "");
  if (!provider) return;

  await prisma.integrationSetting.upsert({
    where: { provider },
    update: { isEnabled, publicKey, webhookUrl, notes },
    create: { provider, isEnabled, publicKey, webhookUrl, notes },
  });

  revalidatePath("/super-admin/integrations");
}

export async function updateBranding(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const logoUrl = String(formData.get("logoUrl") ?? "");
  const primaryColor = String(formData.get("primaryColor") ?? "");
  const secondaryColor = String(formData.get("secondaryColor") ?? "");
  const accentColor = String(formData.get("accentColor") ?? "");
  const panelRadius = Number(formData.get("panelRadius") ?? 24);
  const panelBlur = Number(formData.get("panelBlur") ?? 16);

  const existing = await prisma.brandingSetting.findFirst();
  if (existing) {
    await prisma.brandingSetting.update({
      where: { id: existing.id },
      data: {
        logoUrl,
        primaryColor,
        secondaryColor,
        accentColor,
        panelRadius: Number.isNaN(panelRadius) ? 24 : panelRadius,
        panelBlur: Number.isNaN(panelBlur) ? 16 : panelBlur,
      },
    });
  } else {
    await prisma.brandingSetting.create({
      data: {
        logoUrl,
        primaryColor,
        secondaryColor,
        accentColor,
        panelRadius: Number.isNaN(panelRadius) ? 24 : panelRadius,
        panelBlur: Number.isNaN(panelBlur) ? 16 : panelBlur,
      },
    });
  }

  revalidatePath("/super-admin/branding");
}

export async function toggleMaintenance(formData: FormData) {
  await requireRole([Role.SUPERADMIN]);
  const message = String(formData.get("message") ?? "");
  const existing = await prisma.systemSetting.findFirst();

  if (existing) {
    await prisma.systemSetting.update({
      where: { id: existing.id },
      data: {
        maintenanceMode: !existing.maintenanceMode,
        maintenanceMessage: message || existing.maintenanceMessage,
      },
    });
  } else {
    await prisma.systemSetting.create({
      data: {
        maintenanceMode: true,
        maintenanceMessage: message || "Estamos realizando mejoras.",
      },
    });
  }

  revalidatePath("/super-admin/maintenance");
}

export async function createCoupon(formData: FormData) {
  await requireRole([Role.ADMIN, Role.SUPERADMIN]);
  const code = String(formData.get("code") ?? "").toUpperCase();
  const amount = Number(formData.get("amount") ?? 0);
  const type = String(formData.get("type") ?? "PERCENT");
  if (!code || !amount) return;

  await prisma.coupon.create({
    data: {
      code,
      amount,
      type: type as "PERCENT" | "FIXED",
    },
  });

  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(formData: FormData) {
  await requireRole([Role.ADMIN, Role.SUPERADMIN]);
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}

export async function updateCourseStatus(formData: FormData) {
  await requireRole([Role.ADMIN, Role.SUPERADMIN]);
  const courseId = String(formData.get("courseId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!courseId || !status) return;

  await prisma.course.update({
    where: { id: courseId },
    data: { status: status as "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED" },
  });

  revalidatePath("/admin/courses");
}
