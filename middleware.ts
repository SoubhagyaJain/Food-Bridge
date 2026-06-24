import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import type { Role } from "@/lib/constants";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", ...AUTH_ROUTES];

const ROLE_PREFIXES: Record<Role, string> = {
  donor: "/donor",
  ngo: "/ngo",
  volunteer: "/volunteer",
};

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

  const supabaseResponse = await updateSession(request);

  const userRole = request.cookies.get("fb_role")?.value as Role | undefined;

  if (pathname === "/" && userRole) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = `${ROLE_PREFIXES[userRole]}/dashboard`;
    return NextResponse.redirect(dashboardUrl);
  }

  if (isPublicRoute(pathname)) {
    return supabaseResponse;
  }

  const requiredRole = getRoleFromPath(pathname);
  if (!requiredRole) {
    return supabaseResponse;
  }

  if (!userRole) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (userRole !== requiredRole) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = `${ROLE_PREFIXES[userRole]}/dashboard`;
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|legacy|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};