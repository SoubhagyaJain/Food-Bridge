import Link from "next/link";
import { FactoidCard } from "@/components/features/volunteer/ui/FactoidCard";
import { GettingStartedChecklist } from "@/components/features/volunteer/ui/GettingStartedChecklist";
import { MilestoneTracker } from "@/components/features/volunteer/ui/MilestoneTracker";
import { StatCard } from "@/components/features/volunteer/ui/StatCard";
import { PickupCard } from "@/components/features/volunteer/PickupCard";
import type { PickupWithDonation } from "@/lib/mappers/donation";
import { getGreeting } from "@/lib/volunteer/pickup-ui";
import type { VolunteerImpactStats } from "@/server/queries/pickup.queries";

type VolunteerDashboardViewProps = {
  firstName: string;
  stats: VolunteerImpactStats;
  urgentPickups: PickupWithDonation[];
  profileComplete: boolean;
};

export function VolunteerDashboardView({
  firstName,
  stats,
  urgentPickups,
  profileComplete,
}: VolunteerDashboardViewProps) {
  const greeting = getGreeting();

  const statItems = [
    { label: "Total deliveries", value: String(stats.totalDeliveries) },
    { label: "This month", value: String(stats.deliveriesThisMonth) },
    { label: "Food delivered (kg)", value: stats.totalKg.toFixed(1) },
    { label: "Open near you", value: String(stats.openNearby) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 md:px-8">
      <div className="mb-8 pt-4 md:pt-6">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {greeting}, {firstName}! 👋
        </h1>
        <p className="font-medium text-muted">
          Ready to save some food today? Here&apos;s your impact at a glance.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {statItems.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <MilestoneTracker totalDeliveries={stats.totalDeliveries} />

          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground">Urgent Needs Nearby</h2>
              <Link
                href="/volunteer/pickups"
                className="shrink-0 text-sm font-semibold text-brand-coral hover:underline"
              >
                View all
              </Link>
            </div>
            {urgentPickups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted sm:text-base">
                No open pickups nearby right now.{" "}
                <Link href="/volunteer/profile" className="font-medium text-brand-coral hover:underline">
                  Set your home location
                </Link>{" "}
                to see matches.
              </div>
            ) : (
              <div className="space-y-4">
                {urgentPickups.map((pickup) => (
                  <PickupCard key={pickup.id} pickup={pickup} showAccept variant="dashboard" />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <FactoidCard />
          <GettingStartedChecklist
            profileComplete={profileComplete}
            hasDelivery={stats.totalDeliveries > 0}
          />
        </div>
      </div>
    </div>
  );
}