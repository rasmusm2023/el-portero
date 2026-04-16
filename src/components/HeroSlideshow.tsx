"use client";

import Image from "next/image";
import type { RefObject } from "react";
import { useEffect, useState } from "react";

const INTERVAL_MS = 6000;
const FADE_MS = 1200;
/** Scroll multiplier for background vs foreground (slower movement). */
const PARALLAX_FACTOR = 0.32;
/** Extra scale so parallax does not reveal edges. */
const PARALLAX_SCALE = 1.12;

type Props = {
  images: string[];
  containerRef: RefObject<HTMLElement | null>;
};

export function HeroSlideshow({ images, containerRef }: Props) {
  const [index, setIndex] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [images.length]);

  useEffect(() => {
    if (images.length === 0) return;

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const scrollY = window.scrollY;
      const max = el.offsetHeight + 120;
      const y = Math.min(Math.max(scrollY, 0), max) * PARALLAX_FACTOR;
      setParallaxY(y);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [images.length, containerRef]);

  if (images.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxY}px, 0) scale(${PARALLAX_SCALE})`,
        }}
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              opacity: i === index ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
              zIndex: i === index ? 2 : 1,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
