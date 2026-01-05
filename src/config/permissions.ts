import type { Role } from "@prisma/client";
import permissionMatrix from "./permissions.json";

export type Permission =
  | "bitacora.public.read"
  | "bitacora.private.write"
  | "content.create"
  | "content.approve"
  | "community.ban"
  | "billing.configure";

export const PERMISSION_MATRIX =
  permissionMatrix as Record<Role, readonly Permission[]>;

export function getPermissionsForRole(
  role: Role | null | undefined
): readonly Permission[] {
  if (!role) return [];
  return PERMISSION_MATRIX[role] ?? [];
}

export const PERMISSIONS = Array.from(
  new Set(Object.values(PERMISSION_MATRIX).flat())
) as Permission[];

export function can(
  role: Role | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  const allowed = PERMISSION_MATRIX[role] ?? [];
  return allowed.includes(permission);
}

export function assertCan(
  role: Role | null | undefined,
  permission: Permission
): void {
  if (!can(role, permission)) {
    const roleName = role ?? "no role";
    throw new Error(`Role ${roleName} lacks permission ${permission}`);
  }
}
