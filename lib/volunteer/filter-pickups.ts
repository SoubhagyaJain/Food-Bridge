import type { PickupWithDonation } from "@/lib/mappers/donation";
import { sortByUrgency } from "@/lib/volunteer/pickup-ui";
import type { PickupSearchParams } from "@/lib/volunteer/pickup-search-params";

export function filterAndSortPickups(
  pickups: PickupWithDonation[],
  params: PickupSearchParams,
  fallbackLat?: number,
  fallbackLng?: number
): PickupWithDonation[] {
  let list = [...pickups];
  const lat = params.lat ?? fallbackLat;
  const lng = params.lng ?? fallbackLng;

  if (params.radius > 0 && lat != null && lng != null) {
    list = list.filter((p) => {
      if (p.distanceMeters == null) return true;
      return p.distanceMeters <= params.radius * 1000;
    });
  }

  if (params.sort === "distance") {
    list.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
  } else {
    list = sortByUrgency(list);
  }

  return list;
}