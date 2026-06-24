import Link from "next/link";
import { Wordmark } from "@/components/shared/Wordmark";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-card-muted">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-5">
        <Link href="/">
          <Wordmark />
        </Link>
        <ThemeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-12">{children}</div>
    </div>
  );
}