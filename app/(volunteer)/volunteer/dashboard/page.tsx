import { redirect } from "next/navigation";
import { DashboardView } from "@/components/features/volunteer/dashboard/DashboardView";
import { getRandomFactoid } from "@/lib/volunteer/get-random-factoid";
import { getCurrentProfile } from "@/lib/auth/session";
import { getVolunteerImpactStats } from "@/server/queries/pickup.queries";
import { getVolunteerProfile } from "@/server/queries/volunteer.queries";

export default async function VolunteerDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const firstName = profile.fullName.split(" ")[0];
  const [volunteerProfile, stats] = await Promise.all([
    getVolunteerProfile(profile.id),
    getVolunteerImpactStats(profile.id),
  ]);

  return (
    <DashboardView
      firstName={firstName}
      profileId={profile.id}
      profileComplete={Boolean(volunteerProfile.homeAddress)}
      totalDeliveries={stats.totalDeliveries}
      factoid={getRandomFactoid()}
    />
  );
}