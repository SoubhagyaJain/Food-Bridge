"use client";

import Link from "next/link";
import { useState } from "react";
import { Wordmark } from "@/components/shared/Wordmark";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { MARKETING_NAV } from "@/lib/navigation";

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="rounded-sm transition-colors hover:text-brand-coral-hover">
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-brand-sage"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Donate Now</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="rounded-md p-2 text-foreground hover:bg-accent-hover"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border px-6 py-4 md:hidden">
          <ul className="space-y-1">
            {MARKETING_NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent-hover"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-3 pt-4">
              <Button variant="ghost" className="flex-1" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/login">Donate Now</Link>
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}