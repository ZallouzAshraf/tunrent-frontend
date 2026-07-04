import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOGGED_IN_COOKIE, HOME_COOKIE } from "@/lib/auth/constants";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedClientRoutes = ["/account"];
const protectedDashboardRoutes = ["/dashboard"];
const protectedAdminRoutes = ["/admin"];
const authRoutes = ["/login", "/register", "/verify-email"];

function decodeJwtAgencyId(token: string): string | undefined {
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!base64) return undefined;
    const payload = JSON.parse(atob(base64));
    return typeof payload.agencyId === "string" ? payload.agencyId : undefined;
  } catch {
    return undefined;
  }
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn =
    request.cookies.get(LOGGED_IN_COOKIE)?.value === "1";

  const isProtectedClient = protectedClientRoutes.some((r) =>
    pathname.includes(r),
  );
  const isProtectedDashboard = protectedDashboardRoutes.some((r) =>
    pathname.includes(r),
  );
  const isProtectedAdmin = protectedAdminRoutes.some((r) =>
    pathname.includes(r),
  );
  const isAuthRoute = authRoutes.some((r) => pathname.includes(r));

  if (
    (isProtectedClient || isProtectedDashboard || isProtectedAdmin) &&
    !isLoggedIn
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//")
    ) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }

    const home = request.cookies.get(HOME_COOKIE)?.value;
    if (home === "/admin" || home === "/dashboard" || home === "/account") {
      return NextResponse.redirect(new URL(home, request.url));
    }

    return NextResponse.redirect(new URL("/account", request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
