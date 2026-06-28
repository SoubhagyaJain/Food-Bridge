"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoutButton } from "@/components/shared/LogoutButton";
import { MaterialIcon } from "@/components/features/marketing/MaterialIcon";
import { cn } from "@/lib/utils";

type ProfileMenuProps = {
  isBlogPage: boolean;
  onScrolledBar?: boolean;
  user: { fullName: string; role: string } | null | undefined;
  dashboardHref: string;
};

export function ProfileMenu({ isBlogPage, onScrolledBar = false, user, dashboardHref }: ProfileMenuProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [profileOpen]);

  return (
    <div ref={profileRef} className="relative hidden sm:block">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={profileOpen}
        aria-haspopup="menu"
        onClick={() => setProfileOpen((open) => !open)}
        className={cn(
          "flex items-center gap-2 rounded-full px-1 py-1 transition-colors",
          isBlogPage
            ? "hover:bg-white/5"
            : onScrolledBar
              ? "hover:bg-white/10 dark:hover:bg-hero-nav/10"
              : "hover:bg-surface-container-low dark:hover:bg-hero-nav/10"
        )}
      >
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border",
            isBlogPage
              ? "blog-nav-avatar"
              : onScrolledBar
                ? "border-white/40 bg-white/10 dark:border-hero-nav-border dark:bg-hero-nav/10"
                : "border-outline-variant bg-surface-container-low dark:border-hero-nav-border dark:bg-hero-nav/10"
          )}
        >
          <MaterialIcon
            name="person"
            className={cn(
              "text-lg",
              isBlogPage
                ? "blog-nav-icon"
                : onScrolledBar
                  ? "text-white dark:text-hero-nav"
                  : "text-on-surface-variant dark:text-hero-nav"
            )}
          />
        </div>
        <MaterialIcon
          name="expand_more"
          className={cn(
            "text-xs transition-transform duration-200",
            isBlogPage
              ? "blog-nav-icon"
              : onScrolledBar
                ? "text-white/80 dark:text-hero-nav-muted"
                : "text-on-surface-variant dark:text-hero-nav-muted",
            profileOpen && "rotate-180"
          )}
        />
      </button>

      {profileOpen && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border py-1 shadow-xl",
            isBlogPage
              ? "border-outline-variant/30 bg-[#2a2424]"
              : "border-outline-variant bg-surface-container-highest"
          )}
        >
          {user && (
            <Link
              href={dashboardHref}
              role="menuitem"
              onClick={() => setProfileOpen(false)}
              className={cn(
                "block px-4 py-2.5 text-xs transition-colors",
                isBlogPage
                  ? "text-[#dac1bf] hover:bg-[#3d3636] hover:text-[#ffb3ad]"
                  : "text-on-surface hover:bg-surface-dim"
              )}
            >
              Dashboard
            </Link>
          )}
          {user ? (
            <LogoutButton
              role="menuitem"
              onClick={() => setProfileOpen(false)}
              className={cn(
                "block w-full px-4 py-2.5 text-left text-xs transition-colors",
                isBlogPage
                  ? "text-[#ffb3ad] hover:bg-[#3d3636]"
                  : "text-error hover:bg-surface-dim"
              )}
            />
          ) : (
            <Link
              href="/login"
              role="menuitem"
              onClick={() => setProfileOpen(false)}
              className={cn(
                "block px-4 py-2.5 text-xs transition-colors",
                isBlogPage
                  ? "text-[#dac1bf] hover:bg-[#3d3636] hover:text-[#ffb3ad]"
                  : "text-on-surface hover:bg-surface-dim"
              )}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
}