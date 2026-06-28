"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="font-script text-4xl lowercase tracking-widest text-primary">foodbridge</p>
      <h1 className="font-display text-2xl font-bold text-on-surface">Something went wrong</h1>
      <p className="max-w-md text-sm text-on-surface-variant">
        We hit an unexpected error. You can try again or return home.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-outline-variant px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface transition-colors hover:bg-surface-container-low"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}