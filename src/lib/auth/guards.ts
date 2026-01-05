import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authOptions } from "../auth";
import { can, type Permission } from "@/config/permissions";
import { DEFAULT_LOCALE } from "@/config/i18n";
import { getActiveRoleFromCookies } from "@/lib/auth/activeRole";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth");
  }
  return session;
}

const NO_ACCESS_PATH = `/${DEFAULT_LOCALE}/no-access`;

export async function requireRole(roles: Role[]) {
  const session = await requireSession();
  const role = session.user.role as Role;
  const sessionRoles = session.user.roles ?? [role];
  const activeRole = getActiveRoleFromCookies(cookies(), sessionRoles);
  if (!roles.includes(activeRole)) {
    redirect(NO_ACCESS_PATH);
  }
  return session;
}

export async function requirePermission(permission: Permission) {
  const session = await requireSession();
  const role = session.user.role as Role;
  const sessionRoles = session.user.roles ?? [role];
  const activeRole = getActiveRoleFromCookies(cookies(), sessionRoles);
  if (!can(activeRole, permission)) {
    redirect(NO_ACCESS_PATH);
  }
  return session;
}
