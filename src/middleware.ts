import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOGGED_IN_COOKIE, HOME_COOKIE } from "@/lib/auth/constants";
import { localePrefixFromPath, withLocalePrefix } from "@/lib/locale-path";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedClientRoutes = ["/account"];
const protectedDashboardRoutes = ["/dashboard"];
const protectedAdminRoutes = ["/admin"];
const authRoutes = ["/login", "/register", "/verify-email"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localePrefix = localePrefixFromPath(pathname);
  const isLoggedIn = request.cookies.get(LOGGED_IN_COOKIE)?.value === "1";

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
    const loginUrl = new URL(withLocalePrefix("/login", localePrefix), request.url);
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
      return NextResponse.redirect(
        new URL(withLocalePrefix(home, localePrefix), request.url),
      );
    }

    return NextResponse.redirect(
      new URL(withLocalePrefix("/account", localePrefix), request.url),
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
