import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/constants";
import type { UserProfile } from "@/types/user";

export const getCurrentUser = cache(async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
});

export const getCurrentProfile = cache(async (): Promise<UserProfile | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role as Role,
      phone: data.phone ?? undefined,
      organizationName: data.organization_name ?? undefined,
      onboardingCompleted: data.onboarding_completed ?? true,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
});

export async function requireProfile(): Promise<UserProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  return profile;
}