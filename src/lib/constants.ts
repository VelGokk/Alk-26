import { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  SUPERADMIN: "Superadmin",
  ADMIN: "Admin",
  INSTRUCTOR: "Instructor",
  REVIEWER: "Reviewer",
  MODERATOR: "Moderator",
  USER: "Alumno",
  SUBSCRIBER: "Suscriptor",
};

export const ROLE_HOME: Record<Role, string> = {
  SUPERADMIN: "/super-admin",
  ADMIN: "/admin",
  INSTRUCTOR: "/instructor",
  REVIEWER: "/reviewer",
  MODERATOR: "/moderator",
  USER: "/app",
  SUBSCRIBER: "/app",
};

export const DASHBOARD_ROUTES = [
  { prefix: "/super-admin", roles: [Role.SUPERADMIN] },
  { prefix: "/admin", roles: [Role.ADMIN, Role.SUPERADMIN] },
  { prefix: "/instructor", roles: [Role.INSTRUCTOR, Role.SUPERADMIN] },
  { prefix: "/reviewer", roles: [Role.REVIEWER, Role.SUPERADMIN] },
  { prefix: "/moderator", roles: [Role.MODERATOR, Role.SUPERADMIN] },
  { prefix: "/app", roles: [Role.USER, Role.SUBSCRIBER, Role.SUPERADMIN] }
];
