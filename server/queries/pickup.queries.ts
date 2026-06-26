import {
  mapNearbyPickupRow,
  mapPickupDetailRow,
  mapPickupDetailToSummary,
  mapPickupRow,
  type PickupDetail,
  type PickupWithDonation,
} from "@/lib/mappers/donation";
import { createClient } from "@/lib/supabase/server";

const donationSelect = "title, food_type, quantity, unit, expires_at, locations(formatted_address)";

export type VolunteerImpactStats = {
  totalDeliveries: number;
  deliveriesThisMonth: number;
  totalKg: number;
  openNearby: number;
};

export async function getNearbyOpenPickups(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<PickupWithDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("nearby_open_pickups", {
    p_lat: lat,
    p_lng: lng,
    p_radius_km: radiusKm,
  });

  if (error) throw error;
  return (data ?? []).map(mapNearbyPickupRow);
}

export async function getOpenPickups(): Promise<PickupWithDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pickups")
    .select(`*, donations(${donationSelect})`)
    .eq("status", "open")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) =>
    mapPickupRow(
      row,
      row.donations as {
        title: string;
        food_type: string;
        quantity: number;
        unit: string;
        expires_at: string;
        locations?: { formatted_address: string } | null;
      } | null
    )
  );
}

export async function getVolunteerActiveTasks(volunteerId: string): Promise<PickupWithDonation[]> {
  return getPickupsForVolunteer(volunteerId);
}

export async function getPickupsForVolunteer(volunteerId: string): Promise<PickupWithDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pickups_with_details")
    .select("*")
    .eq("volunteer_id", volunteerId)
    .in("pickup_status", ["assigned", "in_transit"])
    .order("pickup_created_at", { ascending: false });

  if (error) {
    return getPickupsForVolunteerFallback(volunteerId);
  }

  return (data ?? []).map((row) => mapPickupDetailToSummary(mapPickupDetailRow(row)));
}

async function getPickupsForVolunteerFallback(volunteerId: string): Promise<PickupWithDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pickups")
    .select(`*, donations(${donationSelect})`)
    .eq("volunteer_id", volunteerId)
    .in("status", ["assigned", "in_transit"])
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) =>
    mapPickupRow(
      row,
      row.donations as {
        title: string;
        food_type: string;
        quantity: number;
        unit: string;
        expires_at: string;
        locations?: { formatted_address: string } | null;
      } | null
    )
  );
}

export async function getVolunteerHistory(
  volunteerId: string,
  limit = 50
): Promise<PickupWithDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pickups_with_details")
    .select("*")
    .eq("volunteer_id", volunteerId)
    .eq("pickup_status", "delivered")
    .order("delivered_at", { ascending: false })
    .limit(limit);

  if (error) {
    return getVolunteerHistoryFallback(volunteerId, limit);
  }

  return (data ?? []).map((row) => mapPickupDetailToSummary(mapPickupDetailRow(row)));
}

async function getVolunteerHistoryFallback(
  volunteerId: string,
  limit: number
): Promise<PickupWithDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pickups")
    .select(`*, donations(${donationSelect})`)
    .eq("volunteer_id", volunteerId)
    .eq("status", "delivered")
    .order("delivered_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map((row) =>
    mapPickupRow(
      row,
      row.donations as {
        title: string;
        food_type: string;
        quantity: number;
        unit: string;
        expires_at: string;
        locations?: { formatted_address: string } | null;
      } | null
    )
  );
}

export async function getPickupById(id: string): Promise<PickupDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pickups_with_details")
    .select("*")
    .eq("pickup_id", id)
    .maybeSingle();

  if (error || !data) {
    return getPickupByIdFallback(id);
  }

  return mapPickupDetailRow(data);
}

async function getPickupByIdFallback(id: string): Promise<PickupDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pickups")
    .select(`*, donations(${donationSelect})`)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const summary = mapPickupRow(
    data,
    data.donations as {
      title: string;
      food_type: string;
      quantity: number;
      unit: string;
      expires_at: string;
      locations?: { formatted_address: string } | null;
    } | null
  );

  return {
    ...summary,
    description: undefined,
    photoUrl: undefined,
    pickupLat: undefined,
    pickupLng: undefined,
    expiresAt: summary.expiresAt,
    ngo: undefined,
    assignedAt: data.assigned_at ?? undefined,
    pickedUpAt: data.picked_up_at ?? undefined,
    deliveredAt: data.delivered_at ?? undefined,
  };
}

export async function getVolunteerImpactStats(
  volunteerId: string,
  nearbyCount = 0
): Promise<VolunteerImpactStats> {
  const supabase = await createClient();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [totalResult, monthResult, kgResult, openResult] = await Promise.all([
    supabase
      .from("pickups")
      .select("*", { count: "exact", head: true })
      .eq("volunteer_id", volunteerId)
      .eq("status", "delivered"),
    supabase
      .from("pickups")
      .select("*", { count: "exact", head: true })
      .eq("volunteer_id", volunteerId)
      .eq("status", "delivered")
      .gte("delivered_at", monthStart.toISOString()),
    supabase
      .from("pickups_with_details")
      .select("quantity, unit")
      .eq("volunteer_id", volunteerId)
      .eq("pickup_status", "delivered")
      .eq("unit", "kg"),
    supabase.from("pickups").select("*", { count: "exact", head: true }).eq("status", "open"),
  ]);

  let totalKg = 0;
  if (!kgResult.error && kgResult.data) {
    totalKg = kgResult.data.reduce((sum, row) => sum + Number(row.quantity), 0);
  }

  return {
    totalDeliveries: totalResult.count ?? 0,
    deliveriesThisMonth: monthResult.count ?? 0,
    totalKg,
    openNearby: nearbyCount || (openResult.count ?? 0),
  };
}

export async function getVolunteerPickupStats(volunteerId: string) {
  const supabase = await createClient();
  const [assigned, delivered, open] = await Promise.all([
    supabase
      .from("pickups")
      .select("*", { count: "exact", head: true })
      .eq("volunteer_id", volunteerId)
      .in("status", ["assigned", "in_transit"]),
    supabase
      .from("pickups")
      .select("*", { count: "exact", head: true })
      .eq("volunteer_id", volunteerId)
      .eq("status", "delivered"),
    supabase.from("pickups").select("*", { count: "exact", head: true }).eq("status", "open"),
  ]);

  return {
    assigned: assigned.count ?? 0,
    delivered: delivered.count ?? 0,
    open: open.count ?? 0,
  };
}

export function getImpactBadge(totalDeliveries: number): string | null {
  if (totalDeliveries >= 50) return "Community Champion — 50+ deliveries";
  if (totalDeliveries >= 25) return "Dedicated Helper — 25+ deliveries";
  if (totalDeliveries >= 10) return "Rising Star — 10+ deliveries";
  if (totalDeliveries >= 1) return "First delivery complete!";
  return null;
}