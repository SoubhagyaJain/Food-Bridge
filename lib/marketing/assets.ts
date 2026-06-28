/**
 * Curated free marketing imagery — all from Unsplash (unsplash.com/license).
 * Use MarketingImage or marketingImageUrl() so sizing stays consistent.
 */

export type MarketingAssetCategory =
  | "hero"
  | "food"
  | "volunteer"
  | "community"
  | "impact"
  | "avatar";

export type MarketingImageSize = "hero" | "card" | "square" | "avatar" | "thumbnail";

export type MarketingAsset = {
  id: string;
  photoId: string;
  alt: string;
  credit: string;
  category: MarketingAssetCategory;
};

const SIZE_PARAMS: Record<MarketingImageSize, string> = {
  hero: "w=1920&h=1080&fit=crop",
  card: "w=800&h=450&fit=crop",
  square: "w=720&h=720&fit=crop",
  avatar: "w=80&h=80&fit=crop",
  thumbnail: "w=400&h=300&fit=crop",
};

/** Build an optimized Unsplash URL for next/image. */
export function marketingImageUrl(photoId: string, size: MarketingImageSize = "card"): string {
  return `https://images.unsplash.com/${photoId}?${SIZE_PARAMS[size]}&auto=format&q=80`;
}

export function getMarketingAsset(id: string): MarketingAsset | undefined {
  return MARKETING_ASSETS.find((asset) => asset.id === id);
}

export function getMarketingAssetsByCategory(category: MarketingAssetCategory): MarketingAsset[] {
  return MARKETING_ASSETS.filter((asset) => asset.category === category);
}

/** Free stock photos — food, volunteers, and community (Unsplash). */
export const MARKETING_ASSETS: MarketingAsset[] = [
  {
    id: "hero-fresh-produce",
    photoId: "photo-1498837167922-ddd27525cd35",
    alt: "Fresh vegetables and produce arranged on a table",
    credit: "Unsplash",
    category: "hero",
  },
  {
    id: "hero-community-kitchen",
    photoId: "photo-1532629345422-7515f3d4bb68",
    alt: "Volunteers serving meals in a community kitchen",
    credit: "Unsplash",
    category: "hero",
  },
  {
    id: "food-restaurant-plating",
    photoId: "photo-1414235077428-338989a2e8c0",
    alt: "Plated restaurant dishes ready for service",
    credit: "Unsplash",
    category: "food",
  },
  {
    id: "food-produce-market",
    photoId: "photo-1542838132-92c53300491e",
    alt: "Colorful fresh produce at a local market",
    credit: "Unsplash",
    category: "food",
  },
  {
    id: "food-donation-boxes",
    photoId: "photo-1593113597272-26b3657d0bc7",
    alt: "Packed food boxes prepared for distribution",
    credit: "Unsplash",
    category: "food",
  },
  {
    id: "volunteer-team",
    photoId: "photo-1559027615-cd4628902d4a",
    alt: "Volunteers working together outdoors",
    credit: "Unsplash",
    category: "volunteer",
  },
  {
    id: "volunteer-delivery",
    photoId: "photo-1565299585323-38174c4aabaa",
    alt: "Person carrying a food delivery bag",
    credit: "Unsplash",
    category: "volunteer",
  },
  {
    id: "community-meal-share",
    photoId: "photo-1488526539441-bdd89c2b4a4a",
    alt: "Hands preparing food to share with others",
    credit: "Unsplash",
    category: "community",
  },
  {
    id: "impact-hands-food",
    photoId: "photo-1464226184884-fa280b87c0d8",
    alt: "Hands holding fresh vegetables representing shared impact",
    credit: "Unsplash",
    category: "impact",
  },
  {
    id: "avatar-placeholder",
    photoId: "photo-1472099645785-5658abf4ff4e",
    alt: "User avatar placeholder",
    credit: "Unsplash",
    category: "avatar",
  },
];

/** Common presets for landing sections. */
export const MARKETING_PRESETS = {
  heroBackground: "hero-fresh-produce",
  ctaBackground: "hero-community-kitchen",
  donorCard: "food-restaurant-plating",
  volunteerCard: "volunteer-delivery",
  ngoCard: "food-donation-boxes",
  impactFeature: "impact-hands-food",
  avatar: "avatar-placeholder",
} as const;