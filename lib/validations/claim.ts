import { z } from "zod";

export const createClaimSchema = z.object({
  donationId: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

export type CreateClaimInput = z.infer<typeof createClaimSchema>;