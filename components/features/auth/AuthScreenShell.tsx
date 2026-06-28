"use client";

import Link from "next/link";
import { StitchImage } from "@/components/features/marketing/StitchImage";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { STITCH_IMAGES } from "@/lib/marketing/stitch-images";

type AuthScreenShellProps = {
  children: React.ReactNode;
};

/** Cinematic full-screen auth backdrop — Stitch sign-in screen */
export function AuthScreenShell({ children }: AuthScreenShellProps) {
  return (
    <div className="auth-screen relative flex min-h-screen flex-col">
      <div className="absolute inset-0 z-0">
        <StitchImage
          src={STITCH_IMAGES.authSignInBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center saturate-150 contrast-[1.1] brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-[var(--auth-primary)]/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--auth-primary)]/80 to-transparent" />
      </div>

      <Link href="/" className="auth-brand absolute left-6 top-6 z-20 md:left-8 md:top-8">
        FoodBridge
      </Link>

      <ThemeToggle variant="auth" className="absolute right-6 top-6 z-20 md:right-8 md:top-8" />

      <main className="relative z-10 flex min-h-screen w-full flex-1 flex-col items-center justify-center px-margin-mobile py-28 md:px-margin-desktop md:py-24">
        {children}
      </main>
    </div>
  );
}