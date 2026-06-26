import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { isRole } from "@/lib/auth/roles";
import type { Role } from "@/lib/constants";

type RegisterPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const defaultRole = isRole(params.role) ? (params.role as Role) : undefined;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Join foodbridge as a donor, NGO, or volunteer</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm defaultRole={defaultRole} />
      </CardContent>
    </Card>
  );
}