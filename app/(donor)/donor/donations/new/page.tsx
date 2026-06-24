import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewDonationPage() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Post a new donation</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="e.g. Fresh vegetables surplus" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="foodType">Food type</Label>
              <Input id="foodType" name="foodType" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" min="1" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" name="unit" placeholder="kg, boxes, meals..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupAddress">Pickup address</Label>
            <Input id="pickupAddress" name="pickupAddress" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expires at</Label>
            <Input id="expiresAt" name="expiresAt" type="datetime-local" required />
          </div>
          <Button type="submit">Publish donation</Button>
        </form>
      </CardContent>
    </Card>
  );
}