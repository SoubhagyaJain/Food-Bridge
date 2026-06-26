export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: "donor" | "ngo" | "volunteer";
          phone: string | null;
          avatar_url: string | null;
          organization_name: string | null;
          onboarding_completed: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          email: string;
          full_name: string;
          role: "donor" | "ngo" | "volunteer";
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      locations: {
        Row: {
          id: string;
          point: unknown;
          formatted_address: string;
          city: string | null;
          postal_code: string | null;
          created_at: string;
        };
      };
      volunteer_profiles: {
        Row: {
          profile_id: string;
          home_location_id: string | null;
          service_radius_km: number;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["volunteer_profiles"]["Row"]> & {
          profile_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["volunteer_profiles"]["Row"]>;
      };
      donations: {
        Row: {
          id: string;
          donor_id: string;
          pickup_location_id: string;
          title: string;
          description: string | null;
          food_type: string;
          quantity: number;
          unit: "kg" | "lbs" | "meals" | "boxes" | "liters" | "items";
          photo_url: string | null;
          status: "available" | "claimed" | "in_transit" | "delivered" | "expired" | "cancelled";
          expires_at: string;
          claimed_at: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      donations_with_address: {
        Row: Database["public"]["Tables"]["donations"]["Row"] & {
          pickup_address: string;
          pickup_lat: number;
          pickup_lng: number;
        };
      };
      locations_with_coords: {
        Row: {
          id: string;
          formatted_address: string;
          lat: number;
          lng: number;
        };
      };
      pickups_with_details: {
        Row: {
          pickup_id: string;
          donation_id: string;
          claim_id: string;
          volunteer_id: string | null;
          pickup_status: string;
          assigned_at: string | null;
          picked_up_at: string | null;
          delivered_at: string | null;
          pickup_created_at: string;
          title: string;
          description: string | null;
          food_type: string;
          quantity: number;
          unit: string;
          photo_url: string | null;
          donation_status: string;
          expires_at: string;
          pickup_address: string;
          pickup_lat: number;
          pickup_lng: number;
          ngo_id: string;
          ngo_organization_name: string | null;
          ngo_contact_name: string;
          ngo_phone: string | null;
          ngo_email: string;
          donor_name: string;
        };
      };
      claims: {
        Row: {
          id: string;
          donation_id: string;
          ngo_id: string;
          status: "pending" | "approved" | "rejected" | "fulfilled";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      pickups: {
        Row: {
          id: string;
          donation_id: string;
          claim_id: string;
          volunteer_id: string | null;
          status: "open" | "assigned" | "in_transit" | "delivered" | "cancelled";
          assigned_at: string | null;
          picked_up_at: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Functions: {
      create_donation: {
        Args: {
          p_title: string;
          p_description: string | null;
          p_food_type: string;
          p_quantity: number;
          p_unit: string;
          p_formatted_address: string;
          p_lat: number;
          p_lng: number;
          p_expires_at: string;
          p_photo_url?: string | null;
        };
        Returns: Json;
      };
      claim_donation: {
        Args: { p_donation_id: string; p_notes?: string | null };
        Returns: Json;
      };
      accept_pickup: {
        Args: { p_pickup_id: string };
        Returns: Json;
      };
      mark_picked_up: {
        Args: { p_pickup_id: string };
        Returns: Json;
      };
      complete_pickup: {
        Args: { p_pickup_id: string };
        Returns: Json;
      };
      create_location: {
        Args: {
          p_formatted_address: string;
          p_lat: number;
          p_lng: number;
        };
        Returns: string;
      };
      nearby_available_donations: {
        Args: { p_lat: number; p_lng: number; p_radius_km?: number };
        Returns: {
          id: string;
          donor_id: string;
          title: string;
          food_type: string;
          quantity: number;
          unit: string;
          status: string;
          expires_at: string;
          pickup_address: string;
          distance_meters: number;
        }[];
      };
      nearby_open_pickups: {
        Args: { p_lat: number; p_lng: number; p_radius_km?: number };
        Returns: {
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
        }[];
      };
    };
  };
};