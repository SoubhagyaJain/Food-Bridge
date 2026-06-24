import { DonationCard } from "@/components/shared/DonationCard";
import type { Donation } from "@/types/donation";

export function NgoDonationList({ donations }: { donations: Donation[] }) {
  if (donations.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[#EDE6DC] p-8 text-center text-[#5C5146]">
        No available donations right now. Check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {donations.map((donation) => (
        <DonationCard key={donation.id} donation={donation} href={`/ngo/donations/${donation.id}`} />
      ))}
    </div>
  );
}