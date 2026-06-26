import type { PickupWithDonation } from "@/lib/mappers/donation";

export type FoodCategory = "bakery" | "produce" | "meals";
export type Urgency = "high" | "medium" | "low";

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function getFoodCategory(foodType?: string): FoodCategory {
  const t = (foodType ?? "").toLowerCase();
  if (t.includes("bread") || t.includes("bakery") || t.includes("baked") || t.includes("pastry")) {
    return "bakery";
  }
  if (
    t.includes("produce") ||
    t.includes("fruit") ||
    t.includes("vegetable") ||
    t.includes("fresh")
  ) {
    return "produce";
  }
  return "meals";
}

export function getUrgency(expiresAt?: string): Urgency {
  if (!expiresAt) return "low";
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "high";
  const hours = ms / (1000 * 60 * 60);
  if (hours < 2) return "high";
  if (hours < 6) return "medium";
  return "low";
}

export function formatPickupWindow(expiresAt?: string): string {
  if (!expiresAt) return "Pickup window TBD";
  return `Pickup before ${new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(expiresAt))}`;
}

export function formatExpiresIn(expiresAt?: string): string {
  if (!expiresAt) return "Soon";
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} mins`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m`;
}

export function sortByUrgency(pickups: PickupWithDonation[]): PickupWithDonation[] {
  const order: Record<Urgency, number> = { high: 0, medium: 1, low: 2 };
  return [...pickups].sort((a, b) => {
    const ua = order[getUrgency(a.expiresAt)];
    const ub = order[getUrgency(b.expiresAt)];
    if (ua !== ub) return ua - ub;
    if (a.distanceMeters != null && b.distanceMeters != null) {
      return a.distanceMeters - b.distanceMeters;
    }
    return new Date(a.expiresAt ?? 0).getTime() - new Date(b.expiresAt ?? 0).getTime();
  });
}

export function getDonorLabel(pickup: PickupWithDonation): string {
  return pickup.donorName ?? pickup.foodType ?? "Local donor";
}