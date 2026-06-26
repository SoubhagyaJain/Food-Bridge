import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { signOutAction } from "@/server/actions/auth.actions";

type VolunteerTopBarProps = {
  userName?: string;
};

export function VolunteerTopBar({ userName }: VolunteerTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-[#F9F7F3]/95 px-4 backdrop-blur-sm dark:bg-background/95 md:ml-64 md:px-8">
      <div className="flex items-center gap-2 text-sm font-medium text-muted">
        <span className="mr-4 text-xl font-bold text-brand-coral md:hidden">foodbridge</span>
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        {userName && (
          <span className="hidden text-muted-soft md:inline">· {userName}</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <form action={signOutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Logout
          </button>
        </form>
        <ThemeToggle />
      </div>
    </header>
  );
}