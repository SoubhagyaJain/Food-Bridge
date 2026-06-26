import { z } from "zod";
import { ROLES } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLES),
});

export const onboardingSchema = z.object({
  role: z.enum(ROLES),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;