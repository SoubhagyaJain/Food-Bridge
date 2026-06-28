import Image, { type ImageProps } from "next/image";

export const STITCH_CDN_HOST = "lh3.googleusercontent.com";

export function isStitchCdnUrl(src: ImageProps["src"]): boolean {
  return typeof src === "string" && src.includes(STITCH_CDN_HOST);
}

/**
 * Google Stitch CDN images load directly in the browser.
 * Bypasses /_next/image — avoids dev/prod upstream timeouts on huge =s0 URLs.
 */
export function StitchImage({ src, unoptimized, quality, priority, loading, ...props }: ImageProps) {
  const useDirectCdn = unoptimized ?? isStitchCdnUrl(src);
  const resolvedLoading = priority ? "eager" : loading;

  return (
    <Image
      src={src}
      unoptimized={useDirectCdn}
      priority={priority}
      loading={resolvedLoading}
      {...(useDirectCdn ? {} : { quality })}
      {...props}
    />
  );
}