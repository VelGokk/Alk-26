import { Role } from "@prisma/client";
import { DASHBOARD_ROUTES } from "./constants";

export function isRoleAllowed(pathname: string, role?: Role | null) {
  if (!role) return false;
  const match = DASHBOARD_ROUTES.find((route) =>
    pathname.startsWith(route.prefix)
  );
  if (!match) return true;
  return (match.roles as any).includes(role);
}

export function requiredRolesForPath(pathname: string) {
  const match = DASHBOARD_ROUTES.find((route) =>
    pathname.startsWith(route.prefix)
  );
  return match?.roles ?? [];
}
