import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DonorDonationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Donations</h1>
        <Button asChild>
          <Link href="/donor/donations/new">New donation</Link>
        </Button>
      </div>
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        No donations yet. Post your first donation to get started.
      </p>
    </div>
  );
}