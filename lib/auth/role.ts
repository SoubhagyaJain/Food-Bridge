import type { User } from "@supabase/supabase-js";
import type { Role } from "@/lib/constants";
import { ROLES } from "@/lib/constants";

export function getRoleFromUser(user: User | null | undefined): Role | null {
  if (!user) return null;
  const role = user.user_metadata?.role;
  return ROLES.includes(role) ? role : null;
}