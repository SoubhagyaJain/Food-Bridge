import Link from "next/link";
import { PickupListItem } from "@/components/features/volunteer/pickups/PickupListItem";
import { PortalCard } from "@/components/features/volunteer/portal/PortalCard";
import { portalTokens } from "@/lib/volunteer/portal-tokens";
import { getVolunteerOpenPickups } from "@/lib/volunteer/get-volunteer-open-pickups";
import { sortByUrgency } from "@/lib/volunteer/pickup-ui";
import { getVolunteerProfile } from "@/server/queries/volunteer.queries";
import { cn } from "@/lib/utils";

type UrgentPickupsProps = {
  profileId: string;
};

export async function UrgentPickups({ profileId }: UrgentPickupsProps) {
  const volunteerProfile = await getVolunteerProfile(profileId);
  const nearbyPickups = await getVolunteerOpenPickups(volunteerProfile);
  const urgentPickups = sortByUrgency(nearbyPickups).slice(0, 3);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className={cn("text-xl font-bold", portalTokens.textOnPhoto.heading)}>
          Urgent Needs Nearby
        </h2>
        <Link
          href="/volunteer/pickups"
          className="shrink-0 text-sm font-semibold text-brand-coral hover:underline"
        >
          View all
        </Link>
      </div>
      {urgentPickups.length === 0 ? (
        <PortalCard variant="solid" className="border-dashed p-8 text-center text-sm text-muted sm:text-base">
          No open pickups nearby right now.{" "}
          <Link href="/volunteer/profile" className="font-medium text-brand-coral hover:underline">
            Set your home location
          </Link>{" "}
          to see matches.
        </PortalCard>
      ) : (
        <div className="space-y-4">
          {urgentPickups.map((pickup) => (
            <PickupListItem key={pickup.id} pickup={pickup} showAccept variant="dashboard" />
          ))}
        </div>
      )}
    </section>
  );
}