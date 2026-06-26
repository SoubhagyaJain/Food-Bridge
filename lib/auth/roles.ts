import { ROLES, type Role } from "@/lib/constants";

export const ROLE_LABELS: Record<Role, string> = {
  donor: "Donor",
  ngo: "NGO",
  volunteer: "Volunteer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  donor: "Post surplus food for pickup",
  ngo: "Browse and claim donations for your organization",
  volunteer: "Accept and deliver food pickups",
};

export function isRole(value: string | null | undefined): value is Role {
  return ROLES.includes(value as Role);
}

export function roleDashboardPath(role: Role) {
  return `/${role}/dashboard`;
}