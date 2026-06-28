import { Suspense } from "react";
import { DashboardStats } from "@/components/features/volunteer/dashboard/DashboardStats";
import { UrgentPickups } from "@/components/features/volunteer/dashboard/UrgentPickups";
import { VolunteerPageShell } from "@/components/features/volunteer/portal/VolunteerPageShell";
import { portalTokens } from "@/lib/volunteer/portal-tokens";
import { getGreeting } from "@/lib/volunteer/pickup-ui";
import { FactoidCard } from "@/components/features/volunteer/ui/FactoidCard";
import { GettingStartedChecklist } from "@/components/features/volunteer/ui/GettingStartedChecklist";
import { MilestoneTracker } from "@/components/features/volunteer/ui/MilestoneTracker";
import {
  DashboardStatsSkeleton,
  UrgentPickupsSkeleton,
} from "@/components/features/volunteer/ui/VolunteerSkeletons";
import { cn } from "@/lib/utils";

type DashboardViewProps = {
  firstName: string;
  profileId: string;
  profileComplete: boolean;
  totalDeliveries: number;
  factoid: string;
};

export function DashboardView({
  firstName,
  profileId,
  profileComplete,
  totalDeliveries,
  factoid,
}: DashboardViewProps) {
  const greeting = getGreeting();

  return (
    <VolunteerPageShell variant="cinematic" cinematicBg="dashboard">
      <div className="mb-8 pt-4 md:pt-6">
        <h1 className={cn("mb-2 text-2xl font-bold tracking-tight sm:text-3xl", portalTokens.textOnPhoto.heading)}>
          {greeting}, {firstName}!{" "}
          <span aria-hidden="true">
            👋
          </span>
        </h1>
        <p className={cn("font-sans text-body-md font-semibold", portalTokens.textOnPhoto.body)}>
          Ready to save some food today? Here&apos;s your impact at a glance.
        </p>
      </div>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats profileId={profileId} />
      </Suspense>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <MilestoneTracker totalDeliveries={totalDeliveries} />

          <Suspense fallback={<UrgentPickupsSkeleton />}>
            <UrgentPickups profileId={profileId} />
          </Suspense>
        </div>

        <div className="space-y-8">
          <FactoidCard fact={factoid} />
          <GettingStartedChecklist
            profileComplete={profileComplete}
            hasDelivery={totalDeliveries > 0}
          />
        </div>
      </div>
    </VolunteerPageShell>
  );
}