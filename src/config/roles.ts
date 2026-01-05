import { Role } from "@prisma/client";
import type { DashboardSection } from "@/lib/paths";

export const ROLE_LABELS = {
  SUPERADMIN: "Superadmin",
  ADMIN: "Admin",
  INSTRUCTOR: "Instructor",
  REVIEWER: "Reviewer",
  MODERATOR: "Moderator",
  USER: "Alumno",
  SUBSCRIBER: "Suscriptor",
} satisfies Record<Role, string>;

export const ROLE_HOME = {
  SUPERADMIN: "/super-admin",
  ADMIN: "/admin",
  INSTRUCTOR: "/instructor",
  REVIEWER: "/reviewer",
  MODERATOR: "/moderator",
  USER: "/app",
  SUBSCRIBER: "/app",
} satisfies Record<Role, string>;

export const ROLE_DASHBOARD_SECTION: Record<Role, DashboardSection> = {
  SUPERADMIN: "super-admin",
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  REVIEWER: "reviewer",
  MODERATOR: "moderator",
  USER: "app",
  SUBSCRIBER: "app",
};

export type DashboardRoute = {
  prefix: string;
  roles: Role[];
};

export const DASHBOARD_ROUTES: DashboardRoute[] = [
  { prefix: "/super-admin", roles: [Role.SUPERADMIN] },
  { prefix: "/admin", roles: [Role.ADMIN, Role.SUPERADMIN] },
  { prefix: "/instructor", roles: [Role.INSTRUCTOR, Role.SUPERADMIN] },
  { prefix: "/reviewer", roles: [Role.REVIEWER, Role.SUPERADMIN] },
  { prefix: "/moderator", roles: [Role.MODERATOR, Role.SUPERADMIN] },
  { prefix: "/app", roles: [Role.USER, Role.SUBSCRIBER, Role.SUPERADMIN] },
];

export function can(role: Role | null | undefined, permission: Permission) {
  if (!role) return false;
  const allowed = ROLE_PERMISSIONS[role] ?? [];
  return allowed.includes(permission);
}

export function isRoleAllowed(pathname: string, role?: Role | null) {
  if (!role) return false;
  const match = DASHBOARD_ROUTES.find((route) =>
    pathname.startsWith(route.prefix)
  );
  if (!match) return true;
  return match.roles.includes(role);
}

export function requiredRolesForPath(pathname: string) {
  const match = DASHBOARD_ROUTES.find((route) =>
    pathname.startsWith(route.prefix)
  );
  return match?.roles ?? [];
}
