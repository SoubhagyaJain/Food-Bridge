import { VolunteerProfileView } from "@/components/features/volunteer/VolunteerProfileView";
import { requireProfile } from "@/lib/auth/session";
import { getVolunteerImpactStats } from "@/server/queries/pickup.queries";
import { getVolunteerProfile } from "@/server/queries/volunteer.queries";

export default async function VolunteerProfilePage() {
  const profile = await requireProfile();
  const [volunteerProfile, stats] = await Promise.all([
    getVolunteerProfile(profile.id),
    getVolunteerImpactStats(profile.id),
  ]);

  return (
    <VolunteerProfileView
      fullName={profile.fullName}
      profile={volunteerProfile}
      stats={stats}
    />
  );
}