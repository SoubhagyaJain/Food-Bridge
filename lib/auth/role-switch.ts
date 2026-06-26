import { createAdminClient } from "@/lib/supabase/admin";
import type { Role } from "@/lib/constants";

type ProfileForRoleSwitch = {
  role: Role;
  full_name?: string;
  organization_name?: string | null;
  role_switching_enabled?: boolean;
};

export async function applyLoginRole(
  userId: string,
  selectedRole: Role,
  profile: ProfileForRoleSwitch
): Promise<Role> {
  if (!profile.role_switching_enabled) {
    return profile.role;
  }

  if (profile.role === selectedRole) {
    return selectedRole;
  }

  const admin = createAdminClient();

  const { error: profileError } = await admin
    .from("profiles")
    .update({ role: selectedRole })
    .eq("id", userId);

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (selectedRole === "ngo") {
    const orgName =
      profile.organization_name ??
      (profile.full_name ? `${profile.full_name} Organization` : "NGO Organization");

    await admin.from("ngo_profiles").upsert(
      { profile_id: userId, organization_name: orgName },
      { onConflict: "profile_id" }
    );
  }

  await admin.auth.admin.updateUserById(userId, {
    user_metadata: { role: selectedRole },
  });

  return selectedRole;
}