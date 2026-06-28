import type { PickupWithDonation } from "@/lib/mappers/donation";
import { getNearbyOpenPickups, getOpenPickups } from "@/server/queries/pickup.queries";
import type { VolunteerProfile } from "@/server/queries/volunteer.queries";

export async function getVolunteerOpenPickups(
  volunteerProfile: VolunteerProfile
): Promise<PickupWithDonation[]> {
  if (volunteerProfile.homeLat != null && volunteerProfile.homeLng != null) {
    try {
      return await getNearbyOpenPickups(
        volunteerProfile.homeLat,
        volunteerProfile.homeLng,
        volunteerProfile.serviceRadiusKm
      );
    } catch {
      return getOpenPickups();
    }
  }
  return getOpenPickups();
}