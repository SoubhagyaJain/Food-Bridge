import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VolunteerDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
      <p className="text-[#5C5146]">View and accept food pickup assignments near you.</p>
      <Button asChild>
        <Link href="/volunteer/pickups">View pickups</Link>
      </Button>
    </div>
  );
}