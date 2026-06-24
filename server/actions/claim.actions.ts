"use server";

import { revalidatePath } from "next/cache";
import { createClaimSchema } from "@/lib/validations/claim";
import { createClient } from "@/lib/supabase/server";

export async function createClaimAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = createClaimSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { form: ["You must be logged in to claim a donation."] } };
  }

  const { error } = await supabase.from("claims").insert({
    donation_id: parsed.data.donationId,
    ngo_id: user.id,
    notes: parsed.data.notes ?? null,
    status: "pending",
  });

  if (error) {
    return { error: { form: [error.message] } };
  }

  revalidatePath("/ngo/claims");
  return { success: true };
}