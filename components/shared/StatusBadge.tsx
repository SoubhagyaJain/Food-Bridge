import { Badge } from "@/components/ui/badge";
import type { DonationStatus } from "@/lib/constants";

const STATUS_VARIANT: Record<DonationStatus, "default" | "success" | "warning" | "danger"> = {
  available: "success",
  claimed: "warning",
  in_transit: "warning",
  delivered: "default",
  expired: "danger",
  cancelled: "danger",
};

const STATUS_LABEL: Record<DonationStatus, string> = {
  available: "Available",
  claimed: "Claimed",
  in_transit: "In transit",
  delivered: "Delivered",
  expired: "Expired",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: DonationStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}