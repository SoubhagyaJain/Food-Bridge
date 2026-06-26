"use client";

import { useActionState } from "react";
import { createClaimAction } from "@/server/actions/claim.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldErrors = {
  donationId?: string[];
  notes?: string[];
  form?: string[];
};

export function ClaimDonationForm({ donationId }: { donationId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => createClaimAction(formData),
    null
  );

  const fieldErrors = (state && "error" in state ? state.error : undefined) as FieldErrors | undefined;

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border p-6">
      <h2 className="text-lg font-semibold">Claim this donation</h2>
      <input type="hidden" name="donationId" value={donationId} />

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          name="notes"
          placeholder="Pickup instructions or special requirements"
        />
      </div>

      {fieldErrors?.form && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
          {fieldErrors.form[0]}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Claiming…" : "Claim donation"}
      </Button>
    </form>
  );
}