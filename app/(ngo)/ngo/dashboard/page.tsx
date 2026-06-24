import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NgoDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">NGO Dashboard</h1>
      <p className="text-[#5C5146]">Browse available food donations and manage your claims.</p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/ngo/donations">Browse donations</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/ngo/claims">View claims</Link>
        </Button>
      </div>
    </div>
  );
}