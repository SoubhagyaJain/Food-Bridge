import { Badge } from "@/components/ui/badge";

const PICKUP_STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "danger"> = {
  open: "success",
  assigned: "warning",
  in_transit: "warning",
  delivered: "default",
  cancelled: "danger",
};

const PICKUP_STATUS_LABEL: Record<string, string> = {
  open: "Open",
  assigned: "Accepted",
  in_transit: "Picked up",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function PickupStatusBadge({ status }: { status: string }) {
  const variant = PICKUP_STATUS_VARIANT[status] ?? "default";
  const label = PICKUP_STATUS_LABEL[status] ?? status;

  return <Badge variant={variant}>{label}</Badge>;
}