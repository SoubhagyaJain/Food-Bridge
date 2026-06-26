import type { Donation } from "@/types/donation";

type MatchCandidate = Donation & { score: number; distanceKm?: number };

/**
 * Ranks donations by expiry urgency and optional distance (lower distance = higher score).
 */
export function rankDonationsForNgo(
  donations: Donation[],
  ngoLocation?: { lat: number; lng: number }
): MatchCandidate[] {
  const now = Date.now();

  return donations
    .map((donation) => {
      const hoursUntilExpiry =
        (new Date(donation.expiresAt).getTime() - now) / (1000 * 60 * 60);
      const urgencyScore = Math.max(0, 48 - hoursUntilExpiry);

      let distanceScore = 0;
      let distanceKm: number | undefined;

      if (
        ngoLocation &&
        donation.pickupLat !== undefined &&
        donation.pickupLng !== undefined
      ) {
        distanceKm = haversineKm(
          ngoLocation.lat,
          ngoLocation.lng,
          donation.pickupLat,
          donation.pickupLng
        );
        distanceScore = Math.max(0, 50 - distanceKm);
      }

      return {
        ...donation,
        distanceKm,
        score: urgencyScore * 2 + distanceScore,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}