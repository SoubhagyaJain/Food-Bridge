import type { DonationStatus } from "@/lib/constants";

export type Donation = {
  id: string;
  donorId: string;
  title: string;
  description?: string;
  foodType: string;
  quantity: number;
  unit: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  photoUrl?: string;
  status: DonationStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Claim = {
  id: string;
  donationId: string;
  ngoId: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  notes?: string;
  createdAt: string;
};