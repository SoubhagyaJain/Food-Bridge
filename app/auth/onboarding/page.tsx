import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import { isRole } from "@/lib/auth/roles";
import { ROLE_ROUTE_PREFIX, type Role } from "@/lib/constants";
import { OnboardingForm } from "@/components/features/auth/OnboardingForm";
import { Wordmark } from "@/components/shared/Wordmark";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OnboardingPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const params = await searchParams;
  const defaultRole = isRole(params.role) ? (params.role as Role) : undefined;
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.onboardingCompleted) {
    redirect(`${ROLE_ROUTE_PREFIX[profile.role]}/dashboard`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-card-muted">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-5">
        <Link href="/">
          <Wordmark />
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Complete your profile</CardTitle>
            <CardDescription>Tell us how you&apos;ll use foodbridge</CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm fullName={profile.fullName} defaultRole={defaultRole} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}