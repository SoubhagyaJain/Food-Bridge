import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PickupFilters } from "@/components/features/volunteer/pickups/PickupFilters";
import { PickupListItem } from "@/components/features/volunteer/pickups/PickupListItem";
import { PickupViewToggle } from "@/components/features/volunteer/pickups/PickupViewToggle";
import { VolunteerPageHeader } from "@/components/features/volunteer/portal/VolunteerPageHeader";
import { VolunteerPageShell } from "@/components/features/volunteer/portal/VolunteerPageShell";
import { EmptyState } from "@/components/features/volunteer/ui/EmptyState";
import type { PickupWithDonation } from "@/lib/mappers/donation";
import type { PickupSearchParams } from "@/lib/volunteer/pickup-search-params";

const VolunteerPickupMap = dynamic(
  () =>
    import("@/components/features/volunteer/VolunteerPickupMap").then((m) => m.VolunteerPickupMap),
  {
    loading: () => (
      <div
        className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card-muted text-sm text-muted"
        aria-busy="true"
        aria-label="Loading map"
      >
        Loading map…
      </div>
    ),
  }
);

type PickupsViewProps = {
  pickups: PickupWithDonation[];
  params: PickupSearchParams;
  profileLat?: number;
  profileLng?: number;
};

export function PickupsView({ pickups, params, profileLat, profileLng }: PickupsViewProps) {
  const userLat = params.lat ?? profileLat;
  const userLng = params.lng ?? profileLng;

  return (
    <VolunteerPageShell variant="cinematic" cinematicBg="pickups">
      <VolunteerPageHeader
        title="Available Pickups"
        description="Open donations ready for pickup near you."
        onPhoto
        actions={
          <Suspense fallback={<div className="h-10 w-40 animate-pulse rounded-xl bg-border" />}>
            <PickupViewToggle params={params} />
          </Suspense>
        }
      />

      <Suspense fallback={<div className="mb-8 h-20 animate-pulse rounded-2xl bg-border" />}>
        <PickupFilters params={params} profileLat={profileLat} profileLng={profileLng} />
      </Suspense>

      {params.view === "map" ? (
        <VolunteerPickupMap pickups={pickups} userLat={userLat} userLng={userLng} />
      ) : pickups.length === 0 ? (
        <EmptyState
          icon="mapPin"
          title="No open pickups right now"
          description="There are currently no active donations matching your filters. Check back later or try expanding your search radius!"
          buttonText="Update profile"
          buttonHref="/volunteer/profile"
          colorTheme="stone"
        />
      ) : (
        <div className="space-y-4">
          {pickups.map((pickup) => (
            <PickupListItem key={pickup.id} pickup={pickup} showAccept />
          ))}
        </div>
      )}
    </VolunteerPageShell>
  );
}