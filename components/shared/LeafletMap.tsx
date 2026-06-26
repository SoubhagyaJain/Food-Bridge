"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LeafletMapProps = {
  address: string;
  className?: string;
};

const DEFAULT_CENTER: [number, number] = [28.6139, 77.209];

function FixDefaultIcon() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);
  return null;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const results = (await response.json()) as { lat: string; lon: string }[];
    if (!results.length) return null;
    return [Number(results[0].lat), Number(results[0].lon)];
  } catch {
    return null;
  }
}

export function LeafletMap({ address, className = "" }: LeafletMapProps) {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    geocodeAddress(address).then((coords) => {
      if (!active) return;
      if (coords) setCenter(coords);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [address]);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 text-sm text-muted">
          Loading map…
        </div>
      )}
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="z-0 min-h-[220px] w-full"
        style={{ height: 220 }}
      >
        <FixDefaultIcon />
        <RecenterMap center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}