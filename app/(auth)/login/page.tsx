import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { RoleLoginPicker } from "@/components/features/auth/RoleLoginPicker";
import { isRole, ROLE_LABELS } from "@/lib/auth/roles";
import type { Role } from "@/lib/constants";

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string;
    role?: string;
    error?: string;
    error_description?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const role = isRole(params.role) ? (params.role as Role) : null;

  if (!role) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Select your role to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <RoleLoginPicker />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in as {ROLE_LABELS[role]}</CardDescription>
      </CardHeader>
      <CardContent>
        {params.error === "auth_callback_failed" && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
            Google sign-in could not be completed. Please try again.
            {params.error_description && (
              <span className="mt-1 block text-xs opacity-80">
                {decodeURIComponent(params.error_description)}
              </span>
            )}
          </p>
        )}
        {params.error === "role_mismatch" && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
            That account is not registered as {ROLE_LABELS[role]}. Pick the correct role or use
            another account.
          </p>
        )}
        <LoginForm role={role} redirectTo={params.redirect} />
      </CardContent>
    </Card>
  );
}