import Link from "next/link";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { RoleLoginPicker } from "@/components/features/auth/RoleLoginPicker";
import { isRole, ROLE_LABELS } from "@/lib/auth/roles";
import type { Role } from "@/lib/constants";
import { typeBodyStrong, typeDisplay, typeHeadline, typeOnPhoto, typeOnPhotoSm } from "@/lib/typography";
import { cn } from "@/lib/utils";

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
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className={cn("mb-4 text-white text-shadow-dark", typeDisplay)}>
            Sign in
          </h1>
          <p className={cn("mx-auto max-w-2xl", typeOnPhoto)}>
            Select your role to continue. Choose how you want to sign in.
          </p>
        </div>
        <RoleLoginPicker />
        <p className={cn("mt-8 text-center", typeOnPhotoSm)}>
          New here?{" "}
          <Link href="/register" className="font-bold text-white underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-glass-panel mx-auto w-full max-w-md rounded-2xl p-8 shadow-2xl md:p-10">
      <div className="mb-8 text-center">
        <h1 className={cn("mb-2", typeHeadline)}>
          Welcome back
        </h1>
        <p className={typeBodyStrong}>
          Sign in as {ROLE_LABELS[role]}
        </p>
      </div>

      {params.error === "auth_callback_failed" && (
        <p className="mb-4 rounded-lg bg-error-container/90 px-3 py-2 text-sm text-on-error-container">
          Google sign-in could not be completed. Please try again.
          {params.error_description && (
            <span className="mt-1 block text-xs opacity-80">
              {decodeURIComponent(params.error_description)}
            </span>
          )}
        </p>
      )}
      {params.error === "role_mismatch" && (
        <p className="mb-4 rounded-lg bg-error-container/90 px-3 py-2 text-sm text-on-error-container">
          That account is not registered as {ROLE_LABELS[role]}. Pick the correct role or use another
          account.
        </p>
      )}

      <LoginForm role={role} redirectTo={params.redirect} />
    </div>
  );
}