import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { signOutAction } from "@/server/actions/auth.actions";

type VolunteerTopBarProps = {
  userName?: string;
};

export function VolunteerTopBar({ userName }: VolunteerTopBarProps) {
  return (
    <header className="volunteer-nav sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm md:ml-64 md:px-8">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="volunteer-nav-logo mr-4 text-xl font-bold text-brand-coral md:hidden">
          foodbridge
        </span>
        <Link
          href="/"
          className="volunteer-nav-link text-[#544341] transition-colors hover:text-[#201a1a] dark:text-[#e8e0d8] dark:hover:text-[#f5f0e8]"
        >
          Home
        </Link>
        {userName && (
          <span className="hidden text-[#877270] dark:text-[#b8aea3] md:inline">· {userName}</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <form action={signOutAction}>
          <button
            type="submit"
            className="volunteer-nav-link text-sm font-semibold text-[#544341] transition-colors hover:text-[#201a1a] dark:text-[#e8e0d8] dark:hover:text-[#f5f0e8]"
          >
            Logout
          </button>
        </form>
        <ThemeToggle />
      </div>
    </header>
  );
}