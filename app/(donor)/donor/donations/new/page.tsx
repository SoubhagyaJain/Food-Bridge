import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewDonationForm } from "@/components/features/donor/NewDonationForm";

export default function NewDonationPage() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Post a new donation</CardTitle>
      </CardHeader>
      <CardContent>
        <NewDonationForm />
      </CardContent>
    </Card>
  );
}