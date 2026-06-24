export const APP_NAME = "foodbridge";

export const ROLES = ["donor", "ngo", "volunteer"] as const;
export type Role = (typeof ROLES)[number];

export const DONATION_STATUSES = [
  "available",
  "claimed",
  "in_transit",
  "delivered",
  "expired",
  "cancelled",
] as const;

export type DonationStatus = (typeof DONATION_STATUSES)[number];

export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  donor: "/dashboard",
  ngo: "/dashboard",
  volunteer: "/dashboard",
};

export const ROLE_ROUTE_PREFIX: Record<Role, string> = {
  donor: "/donor",
  ngo: "/ngo",
  volunteer: "/volunteer",
};