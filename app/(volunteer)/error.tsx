"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function VolunteerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <h1 className="font-display text-xl font-bold text-on-surface dark:text-surface-bright">
        Dashboard error
      </h1>
      <p className="max-w-md text-sm text-on-surface-variant dark:text-surface-dim">
        Something went wrong loading this page. Your sidebar and navigation are still available.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-[var(--dash-primary)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/volunteer/dashboard"
          className="rounded-lg border border-outline-variant px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface transition-colors hover:bg-surface-container-low dark:text-surface-bright dark:hover:bg-surface-container-highest"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}