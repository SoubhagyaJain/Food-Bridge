import { createClient } from "@/lib/supabase/server";
import type { Claim } from "@/types/donation";

export async function getClaimsByNgo(ngoId: string): Promise<Claim[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select("*")
    .eq("ngo_id", ngoId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as Claim[];
}