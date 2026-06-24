import Link from "next/link";
import { Wordmark } from "@/components/shared/Wordmark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDF8F3]">
      <header className="border-b border-[#EDE6DC] bg-white px-6 py-5">
        <Link href="/">
          <Wordmark />
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-12">{children}</div>
    </div>
  );
}