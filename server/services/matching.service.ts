import type { Donation } from "@/types/donation";

type MatchCandidate = Donation & { score: number };

/**
 * Ranks available donations for an NGO based on proximity and expiry urgency.
 * Replace with real geo + ML matching once location data is available.
 */
export function rankDonationsForNgo(
  donations: Donation[],
  _ngoLocation?: { lat: number; lng: number }
): MatchCandidate[] {
  const now = Date.now();

  return donations
    .map((donation) => {
      const hoursUntilExpiry =
        (new Date(donation.expiresAt).getTime() - now) / (1000 * 60 * 60);
      const urgencyScore = Math.max(0, 48 - hoursUntilExpiry);
      return { ...donation, score: urgencyScore };
    })
    .sort((a, b) => b.score - a.score);
}