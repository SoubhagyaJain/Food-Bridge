import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { isRole } from "@/lib/auth/roles";
import type { Role } from "@/lib/constants";
import { typeBody, typeHeadline } from "@/lib/typography";

type RegisterPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const defaultRole = isRole(params.role) ? (params.role as Role) : undefined;

  return (
    <Card className="mx-auto w-full max-w-md shadow-2xl">
      <CardHeader>
        <CardTitle className={typeHeadline}>Create account</CardTitle>
        <CardDescription className={typeBody}>Join foodbridge as a donor, NGO, or volunteer</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm defaultRole={defaultRole} />
      </CardContent>
    </Card>
  );
}