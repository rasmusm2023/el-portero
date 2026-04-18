"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Per-route enter animation (opacity + slight rise). Firefox does not support the
 * View Transitions API; this Framer layer runs in all browsers.
 *
 * We key by pathname and animate **enter only** (no `AnimatePresence`) so the
 * new segment reliably runs `initial → animate` after App Router swaps.
 */
export default function Template({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      className="flex min-h-0 flex-1 flex-col"
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 10,
            }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.4,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}
