const RPC_ERROR_MESSAGES: Record<string, string> = {
  not_authenticated: "You must be signed in.",
  not_donor: "Only donors can perform this action.",
  not_ngo: "Only NGOs can perform this action.",
  not_volunteer: "Only volunteers can perform this action.",
  invalid_unit: "Invalid unit. Use kg, lbs, meals, boxes, liters, or items.",
  donation_not_found: "Donation not found.",
  donation_unavailable: "This donation is no longer available.",
  donation_expired: "This donation has expired.",
  already_claimed: "This donation has already been claimed.",
  outside_service_radius: "This donation is outside your service area.",
  pickup_not_found: "Pickup not found.",
  pickup_unavailable: "This pickup is no longer available.",
  not_assigned: "You are not assigned to this pickup.",
  invalid_pickup_status: "This pickup cannot be updated in its current state.",
  profile_not_found: "Volunteer profile not found.",
  cannot_cancel: "This donation cannot be cancelled.",
};

export function rpcErrorMessage(code: string | undefined, fallback = "Something went wrong.") {
  if (!code) return fallback;
  return RPC_ERROR_MESSAGES[code] ?? fallback;
}

export function isRpcSuccess(result: unknown): result is { success: true } {
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    (result as { success: boolean }).success === true
  );
}