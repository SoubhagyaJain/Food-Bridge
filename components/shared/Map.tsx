type MapProps = {
  address: string;
  className?: string;
};

/** Placeholder map — swap with Google Maps / Mapbox once API keys are configured. */
export function Map({ address, className = "" }: MapProps) {
  return (
    <div
      className={`flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-accent-hover p-6 text-center text-sm text-muted ${className}`}
    >
      <div>
        <p className="font-medium text-foreground">Map preview</p>
        <p className="mt-1">{address}</p>
      </div>
    </div>
  );
}