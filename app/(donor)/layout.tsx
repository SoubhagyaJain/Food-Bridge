import { Navbar } from "@/components/shared/Navbar";

/** Auth-gated routes — skip static prerender (no CI/user session at build time) */
export const dynamic = "force-dynamic";

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar role="donor" />
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </>
  );
}