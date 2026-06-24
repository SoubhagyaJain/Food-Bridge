import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Pickup = {
  id: string;
  address: string;
  status: string;
};

export function PickupList({ pickups }: { pickups: Pickup[] }) {
  if (pickups.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        No pickup assignments yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {pickups.map((pickup) => (
        <Card key={pickup.id}>
          <CardHeader>
            <CardTitle className="text-base">{pickup.address}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted">Status: {pickup.status}</CardContent>
        </Card>
      ))}
    </div>
  );
}