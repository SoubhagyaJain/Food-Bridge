import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import type { Role } from "@/lib/constants";
import { ROLE_ROUTE_PREFIX } from "@/lib/constants";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", ...AUTH_ROUTES];
const ONBOARDING_ROUTE = "/auth/onboarding";

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function getRoleFromPath(pathname: string): Role | null {
  if (pathname.startsWith("/donor")) return "donor";
  if (pathname.startsWith("/ngo")) return "ngo";
  if (pathname.startsWith("/volunteer")) return "volunteer";
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { response: supabaseResponse, user, profile } = await updateSession(request);
  const userRole = profile?.role ?? null;
  const needsOnboarding = user && profile && !profile.onboardingCompleted;

  if (needsOnboarding && pathname !== ONBOARDING_ROUTE) {
    const onboardingUrl = request.nextUrl.clone();
    onboardingUrl.pathname = ONBOARDING_ROUTE;
    return NextResponse.redirect(onboardingUrl);
  }

  if (pathname === ONBOARDING_ROUTE) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
    if (profile?.onboardingCompleted) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = userRole
        ? `${ROLE_ROUTE_PREFIX[userRole]}/dashboard`
        : "/";
      return NextResponse.redirect(dashboardUrl);
    }
    return supabaseResponse;
  }

  if (pathname === "/register" && user && userRole && profile?.onboardingCompleted) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = `${ROLE_ROUTE_PREFIX[userRole]}/dashboard`;
    return NextResponse.redirect(dashboardUrl);
  }

  if (isPublicRoute(pathname)) {
    return supabaseResponse;
  }

  const requiredRole = getRoleFromPath(pathname);
  if (!requiredRole) {
    return supabaseResponse;
  }

  if (!user || !userRole || needsOnboarding) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (userRole !== requiredRole) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = `${ROLE_ROUTE_PREFIX[userRole]}/dashboard`;
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|legacy|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};