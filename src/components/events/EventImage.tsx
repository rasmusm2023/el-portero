import Image, { type ImageProps } from "next/image";

type EventImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Default lazy — only the in-view / selected card should use eager. */
  loading?: NonNullable<ImageProps["loading"]>;
} & Pick<ImageProps, "fill" | "sizes">;

const unsplash = "https://images.unsplash.com/";

/**
 * Unsplash is optimized; any other host (e.g. R2) uses `unoptimized` so we do not need `images.remotePatterns` for every bucket.
 */
export function EventImage({ src, alt, className, fill, sizes, loading = "lazy" }: EventImageProps) {
  const trimmed = src.trim();
  if (!trimmed) return null;

  return (
    <Image
      src={trimmed}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      loading={loading}
      unoptimized={!trimmed.startsWith(unsplash)}
    />
  );
}
