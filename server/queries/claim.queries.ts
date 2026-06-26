import { mapClaimRow, mapClaimWithDonation, type ClaimWithDonation } from "@/lib/mappers/donation";
import { createClient } from "@/lib/supabase/server";
import type { Claim } from "@/types/donation";

const donationSelect = "title, status, locations(formatted_address)";

export async function getClaimsByNgo(ngoId: string): Promise<ClaimWithDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select(`*, donations(${donationSelect})`)
    .eq("ngo_id", ngoId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) =>
    mapClaimWithDonation(row as Parameters<typeof mapClaimWithDonation>[0])
  );
}

export async function getClaimCountByNgo(ngoId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("claims")
    .select("*", { count: "exact", head: true })
    .eq("ngo_id", ngoId);

  if (error) throw error;
  return count ?? 0;
}

export async function getClaimByDonationAndNgo(
  donationId: string,
  ngoId: string
): Promise<Claim | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select("*")
    .eq("donation_id", donationId)
    .eq("ngo_id", ngoId)
    .maybeSingle();

  if (error || !data) return null;
  return mapClaimRow(data);
}