import { Navbar } from "@/components/shared/Navbar";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar role="volunteer" />
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </>
  );
}