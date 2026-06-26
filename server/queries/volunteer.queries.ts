import { createClient } from "@/lib/supabase/server";

export type VolunteerProfile = {
  profileId: string;
  phone?: string;
  homeAddress?: string;
  homeLat?: number;
  homeLng?: number;
  serviceRadiusKm: number;
  isAvailable: boolean;
};

export async function getVolunteerProfile(profileId: string): Promise<VolunteerProfile> {
  const supabase = await createClient();

  const [profileResult, volunteerResult] = await Promise.all([
    supabase.from("profiles").select("phone").eq("id", profileId).single(),
    supabase
      .from("volunteer_profiles")
      .select("service_radius_km, is_available, home_location_id")
      .eq("profile_id", profileId)
      .maybeSingle(),
  ]);

  const phone = profileResult.data?.phone ?? undefined;
  const vp = volunteerResult.data;

  let homeAddress: string | undefined;
  let homeLat: number | undefined;
  let homeLng: number | undefined;

  if (vp?.home_location_id) {
    const { data: loc } = await supabase
      .from("locations_with_coords")
      .select("formatted_address, lat, lng")
      .eq("id", vp.home_location_id)
      .single();

    if (loc) {
      homeAddress = loc.formatted_address;
      homeLat = Number(loc.lat);
      homeLng = Number(loc.lng);
    }
  }

  return {
    profileId,
    phone,
    homeAddress,
    homeLat,
    homeLng,
    serviceRadiusKm: Number(vp?.service_radius_km ?? 25),
    isAvailable: vp?.is_available ?? true,
  };
}

export async function getVolunteerHomeCoords(
  profileId: string
): Promise<{ lat: number; lng: number; radiusKm: number } | null> {
  const profile = await getVolunteerProfile(profileId);
  if (profile.homeLat == null || profile.homeLng == null) return null;

  return {
    lat: profile.homeLat,
    lng: profile.homeLng,
    radiusKm: profile.serviceRadiusKm,
  };
}