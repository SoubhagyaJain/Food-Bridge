import type { VolunteerHistoryMission } from "@/server/queries/pickup.queries";

export type ComputedHistoryStats = {
  totalMissions: number;
  mealsRescued: number;
  mealsRescuedDisplay: string;
  co2OffsetDisplay: string;
  activeDays: number;
};

export function computeHistoryStats(missions: VolunteerHistoryMission[]): ComputedHistoryStats {
  const totalMissions = missions.length;

  let mealsRescued = 0;
  let totalKg = 0;

  for (const mission of missions) {
    const qty = mission.quantity ?? 0;
    const unit = (mission.unit ?? "meals").toLowerCase();
    if (unit === "kg") {
      totalKg += qty;
      mealsRescued += Math.round(qty * 2);
    } else {
      mealsRescued += qty;
    }
  }

  const co2Kg = totalKg * 2.5;
  const co2OffsetDisplay =
    co2Kg >= 1000 ? `${(co2Kg / 1000).toFixed(1)}t` : `${Math.round(co2Kg)}kg`;

  const activeDays = new Set(
    missions
      .filter((m) => m.deliveredAt)
      .map((m) => new Date(m.deliveredAt!).toDateString())
  ).size;

  const mealsRescuedDisplay =
    mealsRescued >= 100 ? `${Math.floor(mealsRescued / 50) * 50}+` : String(mealsRescued);

  return {
    totalMissions,
    mealsRescued,
    mealsRescuedDisplay,
    co2OffsetDisplay,
    activeDays,
  };
}