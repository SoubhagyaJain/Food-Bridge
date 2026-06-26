import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { applyLoginRole } from "@/lib/auth/role-switch";
import { isRole } from "@/lib/auth/roles";
import { ROLE_ROUTE_PREFIX, type Role } from "@/lib/constants";

function safeRedirectPath(path: string | null): string {
  if (path && path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }
  return "/";
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const oauthErrorDescription = searchParams.get("error_description");
  const next = safeRedirectPath(searchParams.get("next"));
  const intendedRole = searchParams.get("role");

  function loginErrorUrl(extra: Record<string, string>) {
    const url = new URL(`${origin}/login`);
    if (isRole(intendedRole)) url.searchParams.set("role", intendedRole);
    for (const [key, value] of Object.entries(extra)) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  }

  if (oauthError) {
    const description = oauthErrorDescription ?? oauthError;
    return NextResponse.redirect(
      loginErrorUrl({
        error: "auth_callback_failed",
        error_description: description,
      })
    );
  }

  if (!code) {
    return NextResponse.redirect(
      loginErrorUrl({
        error: "auth_callback_failed",
        error_description: "No authorization code received.",
      })
    );
  }

  let response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      loginErrorUrl({
        error: "auth_callback_failed",
        error_description: error.message,
      })
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let destination = next;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_completed, role_switching_enabled, full_name, organization_name")
      .eq("id", user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      destination = isRole(intendedRole)
        ? `/auth/onboarding?role=${intendedRole}`
        : "/auth/onboarding";
    } else if (profile) {
      let effectiveRole = profile.role as Role | undefined;

      if (isRole(intendedRole)) {
        if (profile.role_switching_enabled) {
          try {
            effectiveRole = await applyLoginRole(user.id, intendedRole, {
              role: profile.role as Role,
              full_name: profile.full_name,
              organization_name: profile.organization_name,
              role_switching_enabled: true,
            });
          } catch {
            await supabase.auth.signOut();
            const mismatch = NextResponse.redirect(
              `${origin}/login?role=${intendedRole}&error=role_mismatch`
            );
            response.cookies.getAll().forEach((cookie) => {
              mismatch.cookies.set(cookie);
            });
            return mismatch;
          }
        } else if (profile.role !== intendedRole) {
          await supabase.auth.signOut();
          const mismatch = NextResponse.redirect(
            `${origin}/login?role=${intendedRole}&error=role_mismatch`
          );
          response.cookies.getAll().forEach((cookie) => {
            mismatch.cookies.set(cookie);
          });
          return mismatch;
        } else {
          effectiveRole = intendedRole;
        }
      }

      if (effectiveRole && effectiveRole in ROLE_ROUTE_PREFIX && next === "/") {
        destination = `${ROLE_ROUTE_PREFIX[effectiveRole]}/dashboard`;
      }
    }
  }

  if (destination !== next) {
    const redirectResponse = NextResponse.redirect(`${origin}${destination}`);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    response = redirectResponse;
  }

  return response;
}