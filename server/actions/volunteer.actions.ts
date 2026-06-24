"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function acceptPickupAction(pickupId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("pickups")
    .update({ volunteer_id: user.id, status: "assigned" })
    .eq("id", pickupId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/volunteer/pickups");
  return { success: true };
}