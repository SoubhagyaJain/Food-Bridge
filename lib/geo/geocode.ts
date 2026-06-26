const DEFAULT_COORDS = { lat: 28.6139, lng: 77.209 };

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  const trimmed = address.trim();
  if (!trimmed) return DEFAULT_COORDS;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=1`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "FoodBridge/1.0",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) return DEFAULT_COORDS;

    const results = (await response.json()) as { lat: string; lon: string }[];
    if (!results.length) return DEFAULT_COORDS;

    return {
      lat: Number(results[0].lat),
      lng: Number(results[0].lon),
    };
  } catch {
    return DEFAULT_COORDS;
  }
}