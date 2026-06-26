"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClaimSchema } from "@/lib/validations/claim";
import { isRpcSuccess, rpcErrorMessage } from "@/lib/rpc/errors";
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

  const { data, error } = await supabase.rpc("claim_donation", {
    p_donation_id: parsed.data.donationId,
    p_notes: parsed.data.notes ?? null,
  });

  if (error) {
    return { error: { form: [error.message] } };
  }

  if (!isRpcSuccess(data)) {
    const code =
      typeof data === "object" && data && "error_code" in data
        ? String((data as { error_code: string }).error_code)
        : undefined;
    return { error: { form: [rpcErrorMessage(code)] } };
  }

  revalidatePath("/ngo/claims");
  revalidatePath("/ngo/donations");
  revalidatePath("/volunteer/pickups");
  redirect("/ngo/claims");
}