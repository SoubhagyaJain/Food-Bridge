import { VolunteerDashboardView } from "@/components/features/volunteer/VolunteerDashboardView";
import { requireProfile } from "@/lib/auth/session";
import { sortByUrgency } from "@/lib/volunteer/pickup-ui";
import {
  getNearbyOpenPickups,
  getOpenPickups,
  getVolunteerImpactStats,
} from "@/server/queries/pickup.queries";
import { getVolunteerHomeCoords, getVolunteerProfile } from "@/server/queries/volunteer.queries";

export default async function VolunteerDashboardPage() {
  const profile = await requireProfile();
  const firstName = profile.fullName.split(" ")[0];
  const homeCoords = await getVolunteerHomeCoords(profile.id);
  const volunteerProfile = await getVolunteerProfile(profile.id);

  let nearbyPickups = await getOpenPickups();
  let nearbyCount = nearbyPickups.length;

  if (homeCoords) {
    try {
      nearbyPickups = await getNearbyOpenPickups(
        homeCoords.lat,
        homeCoords.lng,
        homeCoords.radiusKm
      );
      nearbyCount = nearbyPickups.length;
    } catch {
      nearbyPickups = await getOpenPickups();
    }
  }

  const [stats, urgentPickups] = await Promise.all([
    getVolunteerImpactStats(profile.id, nearbyCount),
    Promise.resolve(sortByUrgency(nearbyPickups).slice(0, 3)),
  ]);

  return (
    <VolunteerDashboardView
      firstName={firstName}
      stats={stats}
      urgentPickups={urgentPickups}
      profileComplete={Boolean(volunteerProfile.homeAddress)}
    />
  );
}