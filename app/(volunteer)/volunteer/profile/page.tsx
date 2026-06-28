import { redirect } from "next/navigation";
import { VolunteerProfileView } from "@/components/features/volunteer/VolunteerProfileView";
import { getCurrentProfile } from "@/lib/auth/session";
import { getVolunteerImpactStats } from "@/server/queries/pickup.queries";
import { getVolunteerProfile } from "@/server/queries/volunteer.queries";

export default async function VolunteerProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

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