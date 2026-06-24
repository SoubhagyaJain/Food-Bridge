import { getAvailableDonations } from "@/server/queries/donation.queries";
import { NgoDonationList } from "@/components/features/ngo/NgoDonationList";
import type { Donation } from "@/types/donation";

export default async function NgoDonationsPage() {
  let donations: Donation[] = [];
  try {
    donations = await getAvailableDonations();
  } catch {
    donations = [];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Available Donations</h1>
      <NgoDonationList donations={donations} />
    </div>
  );
}