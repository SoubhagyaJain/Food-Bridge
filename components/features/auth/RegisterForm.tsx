"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/server/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLES } from "@/lib/constants";
import { GoogleSignInButton } from "@/components/features/auth/GoogleSignInButton";
import { AuthDivider } from "@/components/features/auth/AuthDivider";

type AuthFieldErrors = {
  email?: string[];
  password?: string[];
  fullName?: string[];
  role?: string[];
  form?: string[];
};

export function RegisterForm({
  defaultRole,
}: {
  defaultRole?: (typeof ROLES)[number];
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => registerAction(formData),
    null
  );

  const fieldErrors = (state && "error" in state ? state.error : undefined) as AuthFieldErrors | undefined;
  const successMessage = state && "message" in state ? state.message : undefined;

  if (successMessage) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-lg bg-brand-sage/10 px-4 py-3 text-sm text-foreground">{successMessage}</p>
        <Button asChild className="w-full">
          <Link href="/login">Go to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GoogleSignInButton />
      <AuthDivider label="or register with email" />

    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" required aria-invalid={!!fieldErrors?.fullName} />
        {fieldErrors?.fullName && (
          <p className="text-sm text-red-600">{fieldErrors.fullName[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required aria-invalid={!!fieldErrors?.email} />
        {fieldErrors?.email && (
          <p className="text-sm text-red-600">{fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required aria-invalid={!!fieldErrors?.password} />
        {fieldErrors?.password && (
          <p className="text-sm text-red-600">{fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">I am a</Label>
        <select
          id="role"
          name="role"
          defaultValue={defaultRole}
          className="flex h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground"
          required
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
        {fieldErrors?.role && (
          <p className="text-sm text-red-600">{fieldErrors.role[0]}</p>
        )}
      </div>

      {fieldErrors?.form && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
          {fieldErrors.form[0]}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-sage hover:underline">
          Sign in
        </Link>
      </p>
    </form>
    </div>
  );
}