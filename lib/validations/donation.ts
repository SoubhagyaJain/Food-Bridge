import { z } from "zod";

export const createDonationSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  foodType: z.string().min(2, "Food type is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  pickupAddress: z.string().min(5, "Pickup address is required"),
  expiresAt: z.string().datetime({ message: "Expiry date is required" }),
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;