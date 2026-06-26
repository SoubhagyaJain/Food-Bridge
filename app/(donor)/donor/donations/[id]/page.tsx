import Image from "next/image";
import { notFound } from "next/navigation";
import { getDonationById } from "@/server/queries/donation.queries";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Map } from "@/components/shared/Map";

export default async function DonorDonationDetailPage({
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

      {donation.photoUrl && (
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src={donation.photoUrl}
            alt={donation.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <div className="grid gap-2 text-sm text-muted">
        <p>
          {donation.foodType} · {donation.quantity} {donation.unit}
        </p>
        <p>Pickup: {donation.pickupAddress}</p>
      </div>

      <Map address={donation.pickupAddress} />
    </div>
  );
}