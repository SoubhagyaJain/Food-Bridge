import Image, { type ImageProps } from "next/image";
import {
  getMarketingAsset,
  marketingImageUrl,
  type MarketingImageSize,
} from "@/lib/marketing/assets";
import { cn } from "@/lib/utils";

type MarketingImageProps = Omit<ImageProps, "src" | "alt"> & {
  assetId: string;
  size?: MarketingImageSize;
  alt?: string;
  className?: string;
};

export function MarketingImage({
  assetId,
  size = "card",
  alt,
  className,
  ...props
}: MarketingImageProps) {
  const asset = getMarketingAsset(assetId);

  if (!asset) {
    return null;
  }

  return (
    <Image
      src={marketingImageUrl(asset.photoId, size)}
      alt={alt ?? asset.alt}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}