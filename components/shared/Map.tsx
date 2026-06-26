"use client";

import dynamic from "next/dynamic";

type MapProps = {
  address: string;
  className?: string;
};

const LeafletMap = dynamic(() => import("@/components/shared/LeafletMap").then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-border bg-accent-hover text-sm text-muted">
      Loading map…
    </div>
  ),
});

export function Map({ address, className = "" }: MapProps) {
  if (!address.trim()) {
    return (
      <div
        className={`flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-accent-hover p-6 text-center text-sm text-muted ${className}`}
      >
        No address provided
      </div>
    );
  }

  return <LeafletMap address={address} className={className} />;
}