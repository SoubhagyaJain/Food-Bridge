import { AvailablePickupsClient } from "@/components/features/volunteer/AvailablePickupsClient";
import { requireProfile } from "@/lib/auth/session";
import { getNearbyOpenPickups, getOpenPickups } from "@/server/queries/pickup.queries";
import { getVolunteerProfile } from "@/server/queries/volunteer.queries";

export default async function VolunteerPickupsPage() {
  const profile = await requireProfile();
  const volunteerProfile = await getVolunteerProfile(profile.id);

  let pickups = await getOpenPickups();

  if (volunteerProfile.homeLat != null && volunteerProfile.homeLng != null) {
    try {
      pickups = await getNearbyOpenPickups(
        volunteerProfile.homeLat,
        volunteerProfile.homeLng,
        volunteerProfile.serviceRadiusKm
      );
    } catch {
      pickups = await getOpenPickups();
    }
  }

  return (
    <AvailablePickupsClient
      initialPickups={pickups}
      profileLat={volunteerProfile.homeLat}
      profileLng={volunteerProfile.homeLng}
      profileRadiusKm={volunteerProfile.serviceRadiusKm}
    />
  );
}