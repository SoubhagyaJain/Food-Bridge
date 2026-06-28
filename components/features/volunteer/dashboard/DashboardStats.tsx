import { PortalStatCard } from "@/components/features/volunteer/portal/PortalStatCard";
import { getVolunteerOpenPickups } from "@/lib/volunteer/get-volunteer-open-pickups";
import { getVolunteerImpactStats } from "@/server/queries/pickup.queries";
import { getVolunteerProfile } from "@/server/queries/volunteer.queries";

type DashboardStatsProps = {
  profileId: string;
};

export async function DashboardStats({ profileId }: DashboardStatsProps) {
  const volunteerProfile = await getVolunteerProfile(profileId);
  const nearbyPickups = await getVolunteerOpenPickups(volunteerProfile);
  const stats = await getVolunteerImpactStats(profileId, nearbyPickups.length);

  const statItems = [
    { label: "Total deliveries", value: String(stats.totalDeliveries) },
    { label: "This month", value: String(stats.deliveriesThisMonth) },
    { label: "Food delivered (kg)", value: stats.totalKg.toFixed(1) },
    { label: "Open near you", value: String(stats.openNearby) },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {statItems.map((stat) => (
        <PortalStatCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}