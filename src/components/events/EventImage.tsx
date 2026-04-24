import Image, { type ImageProps } from "next/image";

type EventImageProps = {
  src: string;
  alt: string;
  className?: string;
} & Pick<ImageProps, "fill" | "sizes">;

const unsplash = "https://images.unsplash.com/";

/**
 * Unsplash is optimized; any other host (e.g. R2) uses `unoptimized` so we do not need `images.remotePatterns` for every bucket.
 */
export function EventImage({ src, alt, className, fill, sizes }: EventImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      unoptimized={!src.startsWith(unsplash)}
    />
  );
}
