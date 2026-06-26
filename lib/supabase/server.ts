import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore when middleware refreshes sessions.
          }
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}