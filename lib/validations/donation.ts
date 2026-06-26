import { z } from "zod";
import { normalizeFoodUnit } from "@/lib/geo/units";

function toIsoDatetime(value: string) {
  if (value.includes("T") && !value.endsWith("Z") && !value.includes("+")) {
    return new Date(value).toISOString();
  }
  return value;
}

export const createDonationSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  foodType: z.string().min(2, "Food type is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z
    .string()
    .min(1, "Unit is required")
    .refine((value) => normalizeFoodUnit(value) !== null, {
      message: "Use kg, lbs, meals, boxes, liters, or items",
    }),
  pickupAddress: z.string().min(5, "Pickup address is required"),
  expiresAt: z
    .string()
    .min(1, "Expiry date is required")
    .transform(toIsoDatetime)
    .pipe(z.string().datetime({ message: "Expiry date is required" })),
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;