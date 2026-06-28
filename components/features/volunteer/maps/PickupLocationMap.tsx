"use client";

import dynamic from "next/dynamic";
import { MapSkeleton } from "@/components/features/volunteer/ui/VolunteerSkeletons";
import type { PickupWithDonation } from "@/lib/mappers/donation";

const VolunteerPickupMap = dynamic(
  () =>
    import("@/components/features/volunteer/VolunteerPickupMap").then((m) => m.VolunteerPickupMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

type PickupLocationMapProps = {
  pickup: PickupWithDonation;
  className?: string;
};

export function PickupLocationMap({ pickup, className }: PickupLocationMapProps) {
  if (pickup.pickupLat == null || pickup.pickupLng == null) {
    return null;
  }

  return (
    <VolunteerPickupMap
      pickups={[pickup]}
      userLat={pickup.pickupLat}
      userLng={pickup.pickupLng}
      className={className}
    />
  );
}