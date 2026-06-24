import type { Role } from "@/lib/constants";

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
  organizationName?: string;
  createdAt: string;
};