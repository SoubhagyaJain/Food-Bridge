import { PickupList } from "@/components/features/volunteer/PickupList";

export default function VolunteerPickupsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pickup Assignments</h1>
      <PickupList pickups={[]} />
    </div>
  );
}