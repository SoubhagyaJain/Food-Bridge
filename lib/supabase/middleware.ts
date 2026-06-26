import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import type { Role } from "@/lib/constants";

export type SessionProfile = {
  role: Role | null;
  onboardingCompleted: boolean;
};

export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: User | null;
  profile: SessionProfile | null;
}> {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: SessionProfile | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role, onboarding_completed")
      .eq("id", user.id)
      .single();

    if (data) {
      const role = data.role as Role;
      profile = {
        role: role === "donor" || role === "ngo" || role === "volunteer" ? role : null,
        onboardingCompleted: data.onboarding_completed ?? true,
      };
    }
  }

  return { response: supabaseResponse, user, profile };
}