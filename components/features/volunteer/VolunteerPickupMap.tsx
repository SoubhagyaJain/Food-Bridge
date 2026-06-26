"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PickupWithDonation } from "@/lib/mappers/donation";

type VolunteerPickupMapProps = {
  pickups: PickupWithDonation[];
  userLat?: number;
  userLng?: number;
  className?: string;
};

const DEFAULT_CENTER: [number, number] = [28.6139, 77.209];

const TILE_URLS = {
  light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

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

function FitBounds({
  points,
}: {
  points: [number, number][];
}) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export function VolunteerPickupMap({
  pickups,
  userLat,
  userLng,
  className = "",
}: VolunteerPickupMapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const pickupPoints = pickups
    .filter((p) => p.pickupLat != null && p.pickupLng != null)
    .map((p) => [p.pickupLat!, p.pickupLng!] as [number, number]);

  const userPoint: [number, number] | null =
    userLat != null && userLng != null ? [userLat, userLng] : null;

  const allPoints = userPoint ? [userPoint, ...pickupPoints] : pickupPoints;
  const center = userPoint ?? pickupPoints[0] ?? DEFAULT_CENTER;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border shadow-inner ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="z-0 min-h-[400px] w-full"
        style={{ height: 400 }}
      >
        <FixDefaultIcon />
        <FitBounds points={allPoints} />
        <TileLayer
          attribution={
            isDark
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
          url={isDark ? TILE_URLS.dark : TILE_URLS.light}
        />
        {userPoint && (
          <Marker position={userPoint}>
            <Popup>You</Popup>
          </Marker>
        )}
        {pickups.map((pickup) => {
          if (pickup.pickupLat == null || pickup.pickupLng == null) return null;
          return (
            <Marker key={pickup.id} position={[pickup.pickupLat, pickup.pickupLng]}>
              <Popup>
                <strong>{pickup.title}</strong>
                <br />
                {pickup.pickupAddress}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}