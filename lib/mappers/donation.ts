import type { DonationStatus } from "@/lib/constants";
import type { Database } from "@/types/database.types";
import type { Claim, Donation } from "@/types/donation";

type DonationRow = Database["public"]["Tables"]["donations"]["Row"];
type DonationWithAddressRow = Database["public"]["Tables"]["donations_with_address"]["Row"];
type ClaimRow = Database["public"]["Tables"]["claims"]["Row"];
type PickupRow = Database["public"]["Tables"]["pickups"]["Row"];

export type PickupWithDonation = {
  id: string;
  donationId: string;
  volunteerId?: string;
  status: string;
  createdAt: string;
  title: string;
  pickupAddress: string;
  foodType?: string;
  quantity?: number;
  unit?: string;
  expiresAt?: string;
  distanceMeters?: number;
  deliveredAt?: string;
  donorName?: string;
  pickupLat?: number;
  pickupLng?: number;
};

export type PickupDetail = PickupWithDonation & {
  description?: string;
  photoUrl?: string;
  pickupLat?: number;
  pickupLng?: number;
  assignedAt?: string;
  pickedUpAt?: string;
  ngo?: {
    organizationName: string;
    contactName: string;
    phone?: string;
    email: string;
  };
};

export type ClaimWithDonation = Claim & {
  donationTitle: string;
  donationStatus: string;
  pickupAddress: string;
};

type PickupDetailRow = {
  pickup_id: string;
  donation_id: string;
  volunteer_id: string | null;
  pickup_status: string;
  pickup_created_at: string;
  title: string;
  description: string | null;
  food_type: string;
  quantity: number;
  unit: string;
  photo_url: string | null;
  expires_at: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  assigned_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  ngo_organization_name: string | null;
  ngo_contact_name: string;
  ngo_phone: string | null;
  ngo_email: string;
  donor_name: string;
};

type NearbyPickupRow = {
  pickup_id: string;
  donation_id: string;
  title: string;
  food_type: string;
  quantity: number;
  unit: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  expires_at: string;
  distance_meters: number;
  donor_name: string;
};

function mapDonationFields(
  row: DonationRow | DonationWithAddressRow,
  address?: string,
  lat?: number,
  lng?: number
): Donation {
  const withAddress = row as DonationWithAddressRow;
  return {
    id: row.id,
    donorId: row.donor_id,
    title: row.title,
    description: row.description ?? undefined,
    foodType: row.food_type,
    quantity: Number(row.quantity),
    unit: row.unit,
    pickupAddress: address ?? withAddress.pickup_address ?? "",
    pickupLat: lat ?? withAddress.pickup_lat,
    pickupLng: lng ?? withAddress.pickup_lng,
    photoUrl: row.photo_url ?? undefined,
    status: row.status as DonationStatus,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapDonationRow(row: DonationRow | DonationWithAddressRow): Donation {
  return mapDonationFields(row);
}

export function mapClaimRow(row: ClaimRow): Claim {
  return {
    id: row.id,
    donationId: row.donation_id,
    ngoId: row.ngo_id,
    status: row.status as Claim["status"],
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapPickupRow(
  row: PickupRow,
  donation?: {
    title: string;
    food_type?: string;
    quantity?: number;
    unit?: string;
    expires_at?: string;
    pickup_address?: string;
    locations?: { formatted_address: string } | null;
  } | null
): PickupWithDonation {
  const address =
    donation?.pickup_address ?? donation?.locations?.formatted_address ?? "";
  return {
    id: row.id,
    donationId: row.donation_id,
    volunteerId: row.volunteer_id ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    title: donation?.title ?? "Food pickup",
    pickupAddress: address,
    foodType: donation?.food_type,
    quantity: donation?.quantity != null ? Number(donation.quantity) : undefined,
    unit: donation?.unit,
    expiresAt: donation?.expires_at,
    deliveredAt: row.delivered_at ?? undefined,
  };
}

export function mapNearbyPickupRow(row: NearbyPickupRow): PickupWithDonation {
  return {
    id: row.pickup_id,
    donationId: row.donation_id,
    status: "open",
    createdAt: row.expires_at,
    title: row.title,
    pickupAddress: row.pickup_address,
    foodType: row.food_type,
    quantity: Number(row.quantity),
    unit: row.unit,
    expiresAt: row.expires_at,
    distanceMeters: Number(row.distance_meters),
    donorName: row.donor_name,
    pickupLat: Number(row.pickup_lat),
    pickupLng: Number(row.pickup_lng),
  };
}

export function mapPickupDetailToSummary(detail: PickupDetail): PickupWithDonation {
  return {
    id: detail.id,
    donationId: detail.donationId,
    volunteerId: detail.volunteerId,
    status: detail.status,
    createdAt: detail.createdAt,
    title: detail.title,
    pickupAddress: detail.pickupAddress,
    foodType: detail.foodType,
    quantity: detail.quantity,
    unit: detail.unit,
    expiresAt: detail.expiresAt,
    deliveredAt: detail.deliveredAt,
    donorName: detail.donorName,
    pickupLat: detail.pickupLat,
    pickupLng: detail.pickupLng,
    distanceMeters: detail.distanceMeters,
  };
}

export function mapPickupDetailRow(row: PickupDetailRow): PickupDetail {
  return {
    id: row.pickup_id,
    donationId: row.donation_id,
    volunteerId: row.volunteer_id ?? undefined,
    status: row.pickup_status,
    createdAt: row.pickup_created_at,
    title: row.title,
    pickupAddress: row.pickup_address,
    foodType: row.food_type,
    quantity: Number(row.quantity),
    unit: row.unit,
    expiresAt: row.expires_at,
    description: row.description ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    pickupLat: Number(row.pickup_lat),
    pickupLng: Number(row.pickup_lng),
    assignedAt: row.assigned_at ?? undefined,
    pickedUpAt: row.picked_up_at ?? undefined,
    deliveredAt: row.delivered_at ?? undefined,
    donorName: row.donor_name ?? undefined,
    ngo: {
      organizationName: row.ngo_organization_name ?? row.ngo_contact_name,
      contactName: row.ngo_contact_name,
      phone: row.ngo_phone ?? undefined,
      email: row.ngo_email,
    },
  };
}

export function mapClaimWithDonation(
  row: ClaimRow & {
    donations:
      | {
          title: string;
          status: string;
          pickup_address?: string;
          locations?: { formatted_address: string } | null;
        }
      | null;
  }
): ClaimWithDonation {
  const address =
    row.donations?.pickup_address ??
    row.donations?.locations?.formatted_address ??
    "";
  return {
    ...mapClaimRow(row),
    donationTitle: row.donations?.title ?? "Unknown donation",
    donationStatus: row.donations?.status ?? "unknown",
    pickupAddress: address,
  };
}