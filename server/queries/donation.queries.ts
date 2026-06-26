import { mapDonationRow } from "@/lib/mappers/donation";
import { createClient } from "@/lib/supabase/server";
import type { Donation } from "@/types/donation";

export async function getDonationsByDonor(donorId: string): Promise<Donation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations_with_address")
    .select("*")
    .eq("donor_id", donorId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapDonationRow);
}

export async function getAvailableDonations(): Promise<Donation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations_with_address")
    .select("*")
    .eq("status", "available")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapDonationRow);
}

export async function getDonationById(id: string): Promise<Donation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations_with_address")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapDonationRow(data);
}