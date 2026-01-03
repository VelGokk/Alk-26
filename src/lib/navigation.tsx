import {
  BookOpen,
  ClipboardList,
  Gauge,
  GraduationCap,
  Layers,
  ShieldCheck,
  Users,
  Wrench,
  CreditCard,
  FileText,
  BadgeCheck,
  Video,
} from "lucide-react";
import type { Role } from "@prisma/client";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: Role[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Superadmin",
    href: "/super-admin",
    icon: <ShieldCheck className="h-4 w-4" />,
    roles: ["SUPERADMIN"],
  },
  {
    label: "Paginas",
    href: "/super-admin/pages",
    icon: <FileText className="h-4 w-4" />,
    roles: ["SUPERADMIN"],
  },
  {
    label: "Usuarios & roles",
    href: "/super-admin/users",
    icon: <Users className="h-4 w-4" />,
    roles: ["SUPERADMIN"],
  },
  {
    label: "Logs",
    href: "/super-admin/logs",
    icon: <ClipboardList className="h-4 w-4" />,
    roles: ["SUPERADMIN"],
  },
  {
    label: "Integraciones",
    href: "/super-admin/integrations",
    icon: <Wrench className="h-4 w-4" />,
    roles: ["SUPERADMIN"],
  },
  {
    label: "Live sessions",
    href: "/super-admin/live-sessions",
    icon: <Video className="h-4 w-4" />,
    roles: ["SUPERADMIN"],
  },
  {
    label: "Branding",
    href: "/super-admin/branding",
    icon: <Layers className="h-4 w-4" />,
    roles: ["SUPERADMIN"],
  },
  {
    label: "Mantenimiento",
    href: "/super-admin/maintenance",
    icon: <Gauge className="h-4 w-4" />,
    roles: ["SUPERADMIN"],
  },
  {
    label: "Admin",
    href: "/admin",
    icon: <Gauge className="h-4 w-4" />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Cursos",
    href: "/admin/courses",
    icon: <BookOpen className="h-4 w-4" />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Usuarios",
    href: "/admin/users",
    icon: <Users className="h-4 w-4" />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Reportes",
    href: "/admin/reports",
    icon: <FileText className="h-4 w-4" />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Live sessions",
    href: "/admin/live-sessions",
    icon: <Video className="h-4 w-4" />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Cupones",
    href: "/admin/coupons",
    icon: <CreditCard className="h-4 w-4" />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Instructor",
    href: "/instructor",
    icon: <GraduationCap className="h-4 w-4" />,
    roles: ["INSTRUCTOR", "SUPERADMIN"],
  },
  {
    label: "Mis cursos",
    href: "/instructor/courses",
    icon: <BookOpen className="h-4 w-4" />,
    roles: ["INSTRUCTOR", "SUPERADMIN"],
  },
  {
    label: "Reviewer",
    href: "/reviewer",
    icon: <ClipboardList className="h-4 w-4" />,
    roles: ["REVIEWER", "SUPERADMIN"],
  },
  {
    label: "Pendientes",
    href: "/reviewer/pending",
    icon: <ClipboardList className="h-4 w-4" />,
    roles: ["REVIEWER", "SUPERADMIN"],
  },
  {
    label: "Historial",
    href: "/reviewer/history",
    icon: <FileText className="h-4 w-4" />,
    roles: ["REVIEWER", "SUPERADMIN"],
  },
  {
    label: "Moderator",
    href: "/moderator",
    icon: <ShieldCheck className="h-4 w-4" />,
    roles: ["MODERATOR", "SUPERADMIN"],
  },
  {
    label: "Reportes",
    href: "/moderator/reports",
    icon: <ClipboardList className="h-4 w-4" />,
    roles: ["MODERATOR", "SUPERADMIN"],
  },
  {
    label: "Alumno",
    href: "/app",
    icon: <Gauge className="h-4 w-4" />,
    roles: ["USER", "SUBSCRIBER", "SUPERADMIN"],
  },
  {
    label: "Mis cursos",
    href: "/app/my-courses",
    icon: <BookOpen className="h-4 w-4" />,
    roles: ["USER", "SUBSCRIBER", "SUPERADMIN"],
  },
  {
    label: "Certificados",
    href: "/app/certificates",
    icon: <BadgeCheck className="h-4 w-4" />,
    roles: ["USER", "SUBSCRIBER", "SUPERADMIN"],
  },
];
