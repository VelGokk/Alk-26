import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { DEFAULT_LOCALE, isLocale } from "./src/lib/i18n";
import { DASHBOARD_ROUTES } from "./src/lib/constants";
import { isRoleAllowed } from "./src/lib/rbac";
import type { Role } from "@prisma/client";

function isPublicFile(pathname: string) {
  return pathname.startsWith("/_next") || pathname.startsWith("/api") || /\.[^/]+$/.test(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicFile(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];

  if (!isLocale(locale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const pathWithoutLocale = `/${segments.slice(1).join("/")}`;
  const isProtected = DASHBOARD_ROUTES.some((route) =>
    pathWithoutLocale.startsWith(route.prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.role || token.isActive === false) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth`;
    url.searchParams.set("next", pathWithoutLocale || "/");
    return NextResponse.redirect(url);
  }

  if (!isRoleAllowed(pathWithoutLocale, token.role as Role)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/access-denied`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
