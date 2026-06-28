"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction, resendConfirmationEmailAction } from "@/server/actions/auth.actions";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GoogleSignInButton } from "@/components/features/auth/GoogleSignInButton";
import { AuthDivider } from "@/components/features/auth/AuthDivider";
import { ROLE_LABELS } from "@/lib/auth/roles";
import type { Role } from "@/lib/constants";
import { typeBodySm } from "@/lib/typography";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  role: Role;
  redirectTo?: string;
};

type AuthFieldErrors = {
  email?: string[];
  password?: string[];
  form?: string[];
};

export function LoginForm({ role, redirectTo }: LoginFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [resendPending, startResendTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const emailNotConfirmed =
    serverError?.toLowerCase().includes("email not confirmed") ?? false;

  const handleResendConfirmation = () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { message: "Enter your email to resend confirmation." });
      return;
    }

    setResendMessage(null);
    const formData = new FormData();
    formData.set("email", email);

    startResendTransition(async () => {
      const result = await resendConfirmationEmailAction(formData);
      if (result && "error" in result) {
        setResendMessage(result.error ?? "Failed to send confirmation email.");
      } else if (result && "message" in result) {
        setResendMessage(result.message);
      }
    });
  };

  const onSubmit = (values: LoginInput) => {
    setServerError(null);
    setResendMessage(null);
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);
    if (redirectTo) formData.set("redirect", redirectTo);
    formData.set("role", role);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result && "error" in result) {
        const errors = result.error as AuthFieldErrors;
        if (errors.email) form.setError("email", { message: errors.email[0] });
        if (errors.password) form.setError("password", { message: errors.password[0] });
        if (errors.form) setServerError(errors.form[0]);
      }
    });
  };

  return (
    <div className="space-y-4">
      <p className={cn("text-center", typeBodySm)}>
        Signing in as <span className="font-bold text-foreground">{ROLE_LABELS[role]}</span>
        {" · "}
        <Link href="/login" className="text-brand-sage hover:underline">
          Change role
        </Link>
      </p>
      <GoogleSignInButton role={role} redirectTo={redirectTo} />
      <AuthDivider label="or sign in with email" />

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <div className="space-y-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
            <p>{serverError}</p>
            {emailNotConfirmed && (
              <button
                type="button"
                className="font-semibold underline underline-offset-2"
                disabled={resendPending}
                onClick={handleResendConfirmation}
              >
                {resendPending ? "Sending…" : "Resend confirmation email"}
              </button>
            )}
          </div>
        )}

        {resendMessage && (
          <p className="rounded-lg bg-brand-sage/10 px-3 py-2 text-sm text-brand-sage">
            {resendMessage}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>

        <p className={cn("text-center", typeBodySm)}>
          No account?{" "}
          <Link href={`/register?role=${role}`} className="font-bold text-brand-sage hover:underline">
            Register
          </Link>
        </p>
      </form>
    </Form>
    </div>
  );
}