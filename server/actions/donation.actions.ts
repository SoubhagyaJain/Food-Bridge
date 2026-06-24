"use server";

import { revalidatePath } from "next/cache";
import { createDonationSchema } from "@/lib/validations/donation";
import { createClient } from "@/lib/supabase/server";

export async function createDonationAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = createDonationSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { form: ["You must be logged in to post a donation."] } };
  }

  const { error } = await supabase.from("donations").insert({
    donor_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    food_type: parsed.data.foodType,
    quantity: parsed.data.quantity,
    unit: parsed.data.unit,
    pickup_address: parsed.data.pickupAddress,
    expires_at: parsed.data.expiresAt,
    status: "available",
  });

  if (error) {
    return { error: { form: [error.message] } };
  }

  revalidatePath("/donor/donations");
  return { success: true };
}