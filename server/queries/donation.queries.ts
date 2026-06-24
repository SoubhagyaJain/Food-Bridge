import { createClient } from "@/lib/supabase/server";
import type { Donation } from "@/types/donation";

export async function getDonationsByDonor(donorId: string): Promise<Donation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("donor_id", donorId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as Donation[];
}

export async function getAvailableDonations(): Promise<Donation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("status", "available")
    .order("expires_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as Donation[];
}

export async function getDonationById(id: string): Promise<Donation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as unknown as Donation;
}