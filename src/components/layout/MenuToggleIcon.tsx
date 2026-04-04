"use client";

import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

type MenuToggleIconProps = {
  open: boolean;
  className?: string;
};

const transition = { duration: 0.32, ease: easeOut };

/** Vertical offset from center for top/bottom bars when closed (px). */
const HAMBURGER_OFFSET = 10;

/** 2px bars (`h-0.5`); one step up from the previous 1.5px stroke. */
const bar =
  "absolute left-0 right-0 h-0.5 rounded-full bg-current origin-center";

/**
 * Hamburger ↔ close: three bars morph into an X (translate + rotate + middle fade).
 */
export function MenuToggleIcon({ open, className = "" }: MenuToggleIconProps) {
  return (
    <span
      className={`relative inline-block size-7 shrink-0 sm:size-8 ${className}`}
      aria-hidden
    >
      <motion.span
        className={bar}
        style={{ top: "calc(50% - 1px)" }}
        initial={false}
        animate={
          open
            ? { y: 0, rotate: 45 }
            : { y: -HAMBURGER_OFFSET, rotate: 0 }
        }
        transition={transition}
      />
      <motion.span
        className={bar}
        style={{ top: "calc(50% - 1px)" }}
        initial={false}
        animate={
          open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
        }
        transition={transition}
      />
      <motion.span
        className={bar}
        style={{ top: "calc(50% - 1px)" }}
        initial={false}
        animate={
          open
            ? { y: 0, rotate: -45 }
            : { y: HAMBURGER_OFFSET, rotate: 0 }
        }
        transition={transition}
      />
    </span>
  );
}
