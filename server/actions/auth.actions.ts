"use server";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/env";
import { loginSchema, onboardingSchema, registerSchema } from "@/lib/validations/auth";
import { applyLoginRole } from "@/lib/auth/role-switch";
import { isRole } from "@/lib/auth/roles";
import { ROLE_ROUTE_PREFIX, type Role } from "@/lib/constants";

function resolveRole(value: unknown): Role {
  if (value === "donor" || value === "ngo" || value === "volunteer") return value;
  return "donor";
}

async function ensureProfileForUser(user: User) {
  const admin = createAdminClient();
  const { data: existing, error: lookupError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (lookupError) {
    if (lookupError.message.includes("Could not find the table")) {
      return {
        error: "Database not set up yet. Run supabase/setup-v1.sql in the Supabase SQL Editor.",
      };
    }
    return { error: lookupError.message };
  }

  if (existing) return { ok: true as const };

  const metadata = user.user_metadata ?? {};
  const role = resolveRole(metadata.role);
  const fullName =
    (typeof metadata.full_name === "string" && metadata.full_name) ||
    (typeof metadata.name === "string" && metadata.name) ||
    user.email?.split("@")[0] ||
    "User";

  const { error: insertError } = await admin.from("profiles").insert({
    id: user.id,
    email: user.email!,
    full_name: fullName,
    role,
    onboarding_completed: true,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  return { ok: true as const };
}

function dashboardPath(role: Role) {
  return `${ROLE_ROUTE_PREFIX[role]}/dashboard`;
}

async function resolveUserRole(userId: string, fallback?: Role): Promise<Role | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", userId)
    .single();

  const role = profile?.role as Role | undefined;
  if (role === "donor" || role === "ngo" || role === "volunteer") return role;
  return fallback ?? null;
}

export async function signInWithGoogleAction(formData: FormData) {
  const redirectTo = formData.get("redirect")?.toString();
  const next = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.url) {
    return { error: "Could not start Google sign-in." };
  }

  redirect(data.url);
}

export async function completeOnboardingAction(formData: FormData) {
  const parsed = onboardingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { form: ["You must be signed in to continue."] } };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      role: parsed.data.role,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (profileError) {
    return { error: { form: [profileError.message] } };
  }

  if (parsed.data.role === "ngo") {
    const admin = createAdminClient();
    const orgName =
      (typeof user.user_metadata?.organization_name === "string" &&
        user.user_metadata.organization_name) ||
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      "NGO Organization";

    await admin.from("ngo_profiles").upsert(
      {
        profile_id: user.id,
        organization_name: orgName,
      },
      { onConflict: "profile_id" }
    );
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      role: parsed.data.role,
      onboarding_completed: true,
    },
  });

  if (metadataError) {
    return { error: { form: [metadataError.message] } };
  }

  redirect(dashboardPath(parsed.data.role));
}

export async function resendConfirmationEmailAction(formData: FormData) {
  const email = formData.get("email")?.toString()?.trim();
  if (!email) {
    return { error: "Enter your email address first." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: "Confirmation email sent. Check your inbox and spam folder.",
  };
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: { form: [error.message] } };
  }

  const ensured = await ensureProfileForUser(data.user);
  if ("error" in ensured) {
    await supabase.auth.signOut();
    return { error: { form: [ensured.error] } };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed, role_switching_enabled, full_name, organization_name")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    return {
      error: {
        form: [
          "Account profile not found. Run supabase/setup-v1.sql in the Supabase SQL Editor, then try again.",
        ],
      },
    };
  }

  const selectedRole = formData.get("role")?.toString();
  if (!isRole(selectedRole)) {
    await supabase.auth.signOut();
    return { error: { form: ["Please choose a role before signing in."] } };
  }

  let effectiveRole = profile.role as Role;

  if (profile.role_switching_enabled) {
    try {
      effectiveRole = await applyLoginRole(data.user.id, selectedRole, {
        role: profile.role as Role,
        full_name: profile.full_name,
        organization_name: profile.organization_name,
        role_switching_enabled: true,
      });
    } catch (err) {
      await supabase.auth.signOut();
      const message = err instanceof Error ? err.message : "Could not switch role.";
      return { error: { form: [message] } };
    }
  } else if (profile.role !== selectedRole) {
    await supabase.auth.signOut();
    return {
      error: {
        form: [
          `This account is registered as ${profile.role}, not ${selectedRole}. Choose the correct role to continue.`,
        ],
      },
    };
  }

  if (!profile.onboarding_completed) {
    redirect("/auth/onboarding");
  }

  const role = effectiveRole;
  const redirectTo = formData.get("redirect")?.toString();
  redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : dashboardPath(role));
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        role: parsed.data.role,
      },
    },
  });

  if (error) {
    return { error: { form: [error.message] } };
  }

  if (!data.session) {
    return {
      success: true,
      message: "Check your email to confirm your account, then sign in.",
    };
  }

  const role = await resolveUserRole(data.user!.id, parsed.data.role);
  if (!role) {
    return { error: { form: ["Account created but profile setup failed. Please try signing in."] } };
  }

  redirect(dashboardPath(role));
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}