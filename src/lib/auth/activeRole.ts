import { Role } from "@prisma/client";
import type { NextRequest } from "next/server";
import type { RequestCookies } from "next/dist/server/web/spec-extension/cookies";

export const ACTIVE_ROLE_COOKIE = "activeRole";
export const DEFAULT_ACTIVE_ROLE = Role.SUBSCRIBER;

function isValidRole(value?: string | null): value is Role {
  if (!value) return false;
  return Object.values(Role).includes(value as Role);
}

export function parseActiveRole(value?: unknown): Role | undefined {
  if (typeof value !== "string") return undefined;
  return isValidRole(value) ? (value as Role) : undefined;
}

export function resolveActiveRole(
  availableRoles: Role[] | undefined,
  override?: string | null,
  fallback: Role = DEFAULT_ACTIVE_ROLE
): Role {
  const normalizedOverride = override && isValidRole(override) ? (override as Role) : undefined;
  const roles = availableRoles && availableRoles.length > 0 ? availableRoles : [fallback];

  if (normalizedOverride && roles.includes(normalizedOverride)) {
    return normalizedOverride;
  }

  return roles[0] ?? fallback;
}

export function getActiveRoleFromCookies(
  cookies: RequestCookies,
  availableRoles: Role[] | undefined,
  fallback: Role = DEFAULT_ACTIVE_ROLE
): Role {
  const cookieValue = cookies.get(ACTIVE_ROLE_COOKIE)?.value ?? null;
  return resolveActiveRole(availableRoles, cookieValue, fallback);
}

export function getActiveRoleFromRequest(
  req: NextRequest,
  availableRoles: Role[] | undefined,
  fallback: Role = DEFAULT_ACTIVE_ROLE
) {
  const cookieValue = req.cookies.get(ACTIVE_ROLE_COOKIE)?.value ?? null;
  return resolveActiveRole(availableRoles, cookieValue, fallback);
}
