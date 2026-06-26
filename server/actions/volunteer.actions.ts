"use server";

import { revalidatePath } from "next/cache";
import { geocodeAddress } from "@/lib/geo/geocode";
import { isRpcSuccess, rpcErrorMessage } from "@/lib/rpc/errors";
import { createClient } from "@/lib/supabase/server";

const VOLUNTEER_PATHS = [
  "/volunteer/dashboard",
  "/volunteer/pickups",
  "/volunteer/tasks",
  "/volunteer/history",
  "/volunteer/profile",
] as const;

function revalidateVolunteerPaths(pickupId?: string) {
  for (const path of VOLUNTEER_PATHS) {
    revalidatePath(path);
  }
  if (pickupId) {
    revalidatePath(`/volunteer/pickups/${pickupId}`);
  }
}

export async function acceptPickupAction(pickupId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data, error } = await supabase.rpc("accept_pickup", {
    p_pickup_id: pickupId,
  });

  if (error) {
    return { error: error.message };
  }

  if (!isRpcSuccess(data)) {
    const code =
      typeof data === "object" && data && "error_code" in data
        ? String((data as { error_code: string }).error_code)
        : undefined;
    return { error: rpcErrorMessage(code) };
  }

  revalidateVolunteerPaths(pickupId);
  return { success: true };
}

export async function markPickedUpAction(pickupId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data, error } = await supabase.rpc("mark_picked_up", {
    p_pickup_id: pickupId,
  });

  if (error) {
    return { error: error.message };
  }

  if (!isRpcSuccess(data)) {
    const code =
      typeof data === "object" && data && "error_code" in data
        ? String((data as { error_code: string }).error_code)
        : undefined;
    return { error: rpcErrorMessage(code) };
  }

  revalidateVolunteerPaths(pickupId);
  return { success: true };
}

export async function completePickupAction(pickupId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data, error } = await supabase.rpc("complete_pickup", {
    p_pickup_id: pickupId,
  });

  if (error) {
    return { error: error.message };
  }

  if (!isRpcSuccess(data)) {
    const code =
      typeof data === "object" && data && "error_code" in data
        ? String((data as { error_code: string }).error_code)
        : undefined;
    return { error: rpcErrorMessage(code) };
  }

  revalidateVolunteerPaths(pickupId);
  return { success: true };
}

export async function updateVolunteerProfileAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const phone = String(formData.get("phone") ?? "").trim() || null;
  const homeAddress = String(formData.get("homeAddress") ?? "").trim();
  const serviceRadiusKm = Number(formData.get("serviceRadiusKm") ?? 25);
  const isAvailable = formData.get("isAvailable") === "true";

  if (!homeAddress) {
    return { error: "Home address is required." };
  }

  const { lat, lng } = await geocodeAddress(homeAddress);

  const { data: locationId, error: locationError } = await supabase.rpc("create_location", {
    p_formatted_address: homeAddress,
    p_lat: lat,
    p_lng: lng,
  });

  if (locationError || !locationId) {
    return { error: locationError?.message ?? "Could not save location." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ phone })
    .eq("id", user.id);

  if (profileError) {
    return { error: profileError.message };
  }

  const { error: volunteerError } = await supabase.from("volunteer_profiles").upsert(
    {
      profile_id: user.id,
      home_location_id: locationId as string,
      service_radius_km: serviceRadiusKm,
      is_available: isAvailable,
    },
    { onConflict: "profile_id" }
  );

  if (volunteerError) {
    return { error: volunteerError.message };
  }

  revalidateVolunteerPaths();
  return { success: true };
}