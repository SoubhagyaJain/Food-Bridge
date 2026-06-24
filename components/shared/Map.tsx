type MapProps = {
  address: string;
  className?: string;
};

/** Placeholder map — swap with Google Maps / Mapbox once API keys are configured. */
export function Map({ address, className = "" }: MapProps) {
  return (
    <div
      className={`flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-[#EDE6DC] bg-[#F8F4EF] p-6 text-center text-sm text-[#5C5146] ${className}`}
    >
      <div>
        <p className="font-medium text-[#3D2B1F]">Map preview</p>
        <p className="mt-1">{address}</p>
      </div>
    </div>
  );
}