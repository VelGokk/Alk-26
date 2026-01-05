import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { DEFAULT_LOCALE, isLocale } from "@/config/i18n";
import { requiredRolesForPath } from "@/config/roles";
import type { Role } from "@prisma/client";
import {
  DEFAULT_ACTIVE_ROLE,
  getActiveRoleFromRequest,
} from "@/lib/auth/activeRole";

const IGNORED_PATH_PREFIXES = [
  "/_next",
  "/api",
  "/api/auth",
  "/favicon.ico",
  "/robots.txt",
];

function shouldSkip(pathname: string) {
  return IGNORED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function getLocaleFromPath(pathname: string) {
  const [, candidate] = pathname.split("/");
  return isLocale(candidate) ? candidate : DEFAULT_LOCALE;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    return NextResponse.next();
  }

  const [, ...restSegments] = segments;
  if (restSegments.length === 0) {
    return NextResponse.next();
  }

  const sanitizedPath = `/${restSegments.join("/")}`;
  const requiredRoles = requiredRolesForPath(sanitizedPath);
  if (requiredRoles.length === 0) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.isActive === false) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = `/${getLocaleFromPath(pathname)}/auth`;
    loginUrl.search = `callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(loginUrl);
  }

  const tokenRoles = (token.roles as Role[]) ?? [];
  const availableRoles =
    tokenRoles.length > 0
      ? tokenRoles
      : [(token.role as Role) ?? DEFAULT_ACTIVE_ROLE];

  const activeRole = getActiveRoleFromRequest(
    req,
    availableRoles,
    DEFAULT_ACTIVE_ROLE
  );

  if (!requiredRoles.includes(activeRole)) {
    const denialUrl = req.nextUrl.clone();
    denialUrl.pathname = `/${getLocaleFromPath(pathname)}/no-access`;
    return NextResponse.redirect(denialUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:lang/:path*"],
};
