import { createClient } from "@/lib/supabase/server";

export type DonorStats = {
  active: number;
  claimed: number;
  delivered: number;
};

export type PlatformStats = {
  donations: number;
  helpedPeople: number;
  volunteers: number;
};

const DEFAULT_PLATFORM_STATS: PlatformStats = {
  donations: 2354,
  helpedPeople: 3500,
  volunteers: 500,
};

export async function getDonorStats(donorId: string): Promise<DonorStats> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("donations").select("status").eq("donor_id", donorId);

  if (error) throw error;

  const rows = data ?? [];
  return {
    active: rows.filter((r) => r.status === "available").length,
    claimed: rows.filter((r) => ["claimed", "in_transit"].includes(r.status)).length,
    delivered: rows.filter((r) => r.status === "delivered").length,
  };
}

export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const supabase = await createClient();
    const [donations, delivered, volunteers] = await Promise.all([
      supabase.from("donations").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("*", { count: "exact", head: true }).eq("status", "delivered"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "volunteer"),
    ]);

    return {
      donations: donations.count ?? DEFAULT_PLATFORM_STATS.donations,
      helpedPeople: delivered.count ?? DEFAULT_PLATFORM_STATS.helpedPeople,
      volunteers: volunteers.count ?? DEFAULT_PLATFORM_STATS.volunteers,
    };
  } catch {
    return DEFAULT_PLATFORM_STATS;
  }
}

export async function getNgoDashboardStats(ngoId: string) {
  const supabase = await createClient();
  const [available, claims] = await Promise.all([
    supabase.from("donations").select("*", { count: "exact", head: true }).eq("status", "available"),
    supabase.from("claims").select("*", { count: "exact", head: true }).eq("ngo_id", ngoId),
  ]);

  return {
    available: available.count ?? 0,
    claims: claims.count ?? 0,
  };
}