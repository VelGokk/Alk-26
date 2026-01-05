import type { AppLocale, AppDictionary } from "./i18n";
import type { Role } from "@prisma/client";
import { paths } from "./paths";
import {
  BadgeCheck,
  BookOpen,
  ClipboardList,
  CreditCard,
  FileText,
  Gauge,
  GraduationCap,
  Layers,
  ShieldCheck,
  Users,
  Video,
  Wrench,
} from "lucide-react";

export const ICON_COMPONENTS = {
  ShieldCheck,
  FileText,
  Users,
  ClipboardList,
  Wrench,
  Video,
  Layers,
  Gauge,
  BookOpen,
  CreditCard,
  GraduationCap,
  BadgeCheck,
} as const;

export type NavigationIconName = keyof typeof ICON_COMPONENTS;

export type FeatureFlags = Record<string, boolean>;

export type DashboardNavItem = {
  id: string;
  labelKey: keyof AppDictionary["dashboard"];
  path: (lang: AppLocale) => string;
  icon: NavigationIconName;
  roles: Role[];
  flag?: string;
};

export const NAVIGATION_ITEMS: DashboardNavItem[] = [
  {
    id: "super-admin",
    labelKey: "superAdmin",
    path: (lang) => paths.dashboard.section(lang, "super-admin"),
    icon: "ShieldCheck",
    roles: ["SUPERADMIN"],
  },
  {
    id: "super-admin-pages",
    labelKey: "pages",
    path: (lang) => paths.dashboard.section(lang, "super-admin") + "/pages",
    icon: "FileText",
    roles: ["SUPERADMIN"],
  },
  {
    id: "super-admin-users",
    labelKey: "usersAndRoles",
    path: (lang) => paths.dashboard.section(lang, "super-admin") + "/users",
    icon: "Users",
    roles: ["SUPERADMIN"],
  },
  {
    id: "super-admin-logs",
    labelKey: "logs",
    path: (lang) => paths.dashboard.section(lang, "super-admin") + "/logs",
    icon: "ClipboardList",
    roles: ["SUPERADMIN"],
  },
  {
    id: "super-admin-legal",
    labelKey: "legal",
    path: (lang) => paths.dashboard.section(lang, "super-admin") + "/legal",
    icon: "FileText",
    roles: ["SUPERADMIN"],
  },
  {
    id: "super-admin-legal-audit",
    labelKey: "legalAudit",
    path: (lang) =>
      paths.dashboard.section(lang, "super-admin") + "/legal/audit",
    icon: "BadgeCheck",
    roles: ["SUPERADMIN"],
  },
  {
    id: "super-admin-integrations",
    labelKey: "integrations",
    path: (lang) => paths.dashboard.section(lang, "super-admin") + "/integrations",
    icon: "Wrench",
    roles: ["SUPERADMIN"],
    flag: "integrations",
  },
  {
    id: "super-admin-live-sessions",
    labelKey: "liveSessions",
    path: (lang) => paths.dashboard.section(lang, "super-admin") + "/live-sessions",
    icon: "Video",
    roles: ["SUPERADMIN"],
    flag: "liveSessions",
  },
  {
    id: "super-admin-branding",
    labelKey: "branding",
    path: (lang) => paths.dashboard.section(lang, "super-admin") + "/branding",
    icon: "Layers",
    roles: ["SUPERADMIN"],
  },
  {
    id: "super-admin-maintenance",
    labelKey: "maintenance",
    path: (lang) => paths.dashboard.section(lang, "super-admin") + "/maintenance",
    icon: "Gauge",
    roles: ["SUPERADMIN"],
  },
  {
    id: "admin",
    labelKey: "adminRoot",
    path: (lang) => paths.dashboard.section(lang, "admin"),
    icon: "Gauge",
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    id: "admin-courses",
    labelKey: "courses",
    path: (lang) => paths.dashboard.section(lang, "admin") + "/courses",
    icon: "BookOpen",
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    id: "admin-users",
    labelKey: "users",
    path: (lang) => paths.dashboard.section(lang, "admin") + "/users",
    icon: "Users",
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    id: "admin-reports",
    labelKey: "reports",
    path: (lang) => paths.dashboard.section(lang, "admin") + "/reports",
    icon: "FileText",
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    id: "admin-live-sessions",
    labelKey: "liveSessions",
    path: (lang) => paths.dashboard.section(lang, "admin") + "/live-sessions",
    icon: "Video",
    roles: ["ADMIN", "SUPERADMIN"],
    flag: "liveSessions",
  },
  {
    id: "admin-coupons",
    labelKey: "coupons",
    path: (lang) => paths.dashboard.section(lang, "admin") + "/coupons",
    icon: "CreditCard",
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    id: "admin-payments",
    labelKey: "payments",
    path: (lang) => paths.dashboard.section(lang, "admin") + "/payments",
    icon: "CreditCard",
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    id: "instructor",
    labelKey: "instructorRoot",
    path: (lang) => paths.dashboard.section(lang, "instructor"),
    icon: "GraduationCap",
    roles: ["INSTRUCTOR", "SUPERADMIN"],
  },
  {
    id: "instructor-courses",
    labelKey: "myCourses",
    path: (lang) => paths.dashboard.section(lang, "instructor") + "/courses",
    icon: "BookOpen",
    roles: ["INSTRUCTOR", "SUPERADMIN"],
  },
  {
    id: "reviewer",
    labelKey: "reviewerRoot",
    path: (lang) => paths.dashboard.section(lang, "reviewer"),
    icon: "ClipboardList",
    roles: ["REVIEWER", "SUPERADMIN"],
  },
  {
    id: "reviewer-pending",
    labelKey: "pending",
    path: (lang) => paths.dashboard.section(lang, "reviewer") + "/pending",
    icon: "ClipboardList",
    roles: ["REVIEWER", "SUPERADMIN"],
  },
  {
    id: "reviewer-history",
    labelKey: "history",
    path: (lang) => paths.dashboard.section(lang, "reviewer") + "/history",
    icon: "FileText",
    roles: ["REVIEWER", "SUPERADMIN"],
  },
  {
    id: "moderator",
    labelKey: "moderatorRoot",
    path: (lang) => paths.dashboard.section(lang, "moderator"),
    icon: "ShieldCheck",
    roles: ["MODERATOR", "SUPERADMIN"],
  },
  {
    id: "moderator-reports",
    labelKey: "moderatorReports",
    path: (lang) => paths.dashboard.section(lang, "moderator") + "/reports",
    icon: "ClipboardList",
    roles: ["MODERATOR", "SUPERADMIN"],
  },
  {
    id: "student",
    labelKey: "studentRoot",
    path: (lang) => paths.dashboard.section(lang, "app"),
    icon: "Gauge",
    roles: ["USER", "SUBSCRIBER", "SUPERADMIN"],
  },
  {
    id: "student-courses",
    labelKey: "studentCourses",
    path: (lang) => paths.dashboard.section(lang, "app") + "/my-courses",
    icon: "BookOpen",
    roles: ["USER", "SUBSCRIBER", "SUPERADMIN"],
  },
  {
    id: "student-certificates",
    labelKey: "certificates",
    path: (lang) => paths.dashboard.section(lang, "app") + "/certificates",
    icon: "BadgeCheck",
    roles: ["USER", "SUBSCRIBER", "SUPERADMIN"],
  },
  {
    id: "student-notifications",
    labelKey: "notifications",
    path: (lang) => paths.dashboard.section(lang, "app") + "/notifications",
    icon: "ClipboardList",
    roles: ["USER", "SUBSCRIBER", "SUPERADMIN"],
  },
];

export function getNavigationForRole(
  role: Role,
  flags: FeatureFlags = {}
) {
  return NAVIGATION_ITEMS.filter((item) => {
    const hasRole = item.roles.includes(role);
    if (!hasRole) return false;
    if (!item.flag) return true;
    const flagValue = flags[item.flag];
    if (flagValue === undefined) return true;
    return Boolean(flagValue);
  });
}
