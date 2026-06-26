import { notFound } from "next/navigation";
import { getDonationById } from "@/server/queries/donation.queries";
import { ClaimDonationForm } from "@/components/features/ngo/ClaimDonationForm";
import { Map } from "@/components/shared/Map";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

export default async function NgoDonationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const donation = await getDonationById(id);

  if (!donation) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">{donation.title}</h1>
        <StatusBadge status={donation.status} />
      </div>

      <p className="text-muted">{donation.description ?? "No description provided."}</p>

      <div className="grid gap-2 text-sm text-muted">
        <p>
          {donation.foodType} · {donation.quantity} {donation.unit}
        </p>
        <p>Expires {formatDate(donation.expiresAt)}</p>
      </div>

      <Map address={donation.pickupAddress} />

      {donation.status === "available" && <ClaimDonationForm donationId={donation.id} />}
    </div>
  );
}