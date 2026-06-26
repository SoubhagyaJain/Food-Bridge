"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createDonationSchema } from "@/lib/validations/donation";
import { geocodeAddress } from "@/lib/geo/geocode";
import { normalizeFoodUnit } from "@/lib/geo/units";
import { isRpcSuccess, rpcErrorMessage } from "@/lib/rpc/errors";
import { createClient } from "@/lib/supabase/server";
import { uploadDonationPhotoServer } from "@/lib/supabase/storage";

function parseDonationFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: formData.get("description")?.toString() || undefined,
    foodType: String(formData.get("foodType") ?? ""),
    quantity: formData.get("quantity"),
    unit: String(formData.get("unit") ?? ""),
    pickupAddress: String(formData.get("pickupAddress") ?? ""),
    expiresAt: String(formData.get("expiresAt") ?? ""),
  };
}

export async function createDonationAction(formData: FormData) {
  const parsed = createDonationSchema.safeParse(parseDonationFormData(formData));

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

  const unit = normalizeFoodUnit(parsed.data.unit);
  if (!unit) {
    return { error: { unit: ["Use kg, lbs, meals, boxes, liters, or items"] } };
  }

  const photoEntry = formData.get("photo");
  let photoUrl: string | null = null;

  if (photoEntry instanceof File && photoEntry.size > 0) {
    try {
      photoUrl = await uploadDonationPhotoServer(photoEntry, user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload photo.";
      return { error: { form: [message] } };
    }
  }

  const coords = await geocodeAddress(parsed.data.pickupAddress);

  const { data, error } = await supabase.rpc("create_donation", {
    p_title: parsed.data.title,
    p_description: parsed.data.description ?? null,
    p_food_type: parsed.data.foodType,
    p_quantity: parsed.data.quantity,
    p_unit: unit,
    p_formatted_address: parsed.data.pickupAddress,
    p_lat: coords.lat,
    p_lng: coords.lng,
    p_expires_at: parsed.data.expiresAt,
    p_photo_url: photoUrl,
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

  revalidatePath("/donor/donations");
  revalidatePath("/donor/dashboard");
  redirect("/donor/donations");
}