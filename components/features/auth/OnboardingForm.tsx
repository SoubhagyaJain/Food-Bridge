"use client";

import { useActionState } from "react";
import { completeOnboardingAction } from "@/server/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ROLES } from "@/lib/constants";

type FieldErrors = {
  role?: string[];
  form?: string[];
};

export function OnboardingForm({
  fullName,
  defaultRole,
}: {
  fullName: string;
  defaultRole?: (typeof ROLES)[number];
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => completeOnboardingAction(formData),
    null
  );

  const fieldErrors = (state && "error" in state ? state.error : undefined) as FieldErrors | undefined;

  return (
    <form action={formAction} className="space-y-6">
      <p className="text-sm text-muted">
        Welcome{fullName ? `, ${fullName}` : ""}! Choose how you want to use foodbridge.
      </p>

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
        {pending ? "Setting up your account…" : "Continue to dashboard"}
      </Button>
    </form>
  );
}