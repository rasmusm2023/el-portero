"use client";

import type { DietaryTagId } from "@/lib/dietaryTags";
import { DIETARY_TAG_IDS, dietaryOption } from "@/lib/dietaryTags";

type Props = {
  /** Only known ids are shown; order follows {@link DIETARY_TAG_IDS}. */
  ids: DietaryTagId[];
  /** Extra wrapper gap / margin if needed. */
  className?: string;
};

export function DietaryTagPills({ ids, className }: Props) {
  if (!ids.length) return null;

  const ordered = DIETARY_TAG_IDS.filter((id) => ids.includes(id));

  return (
    <ul
      className={["mt-2.5 flex flex-wrap gap-1.5", className].filter(Boolean).join(" ")}
      aria-label="Dietary information"
    >
      {ordered.map((id) => {
        const { Icon, label, pillClass } = dietaryOption(id);
        return (
          <li
            key={id}
            className={[
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] uppercase",
              pillClass,
            ].join(" ")}
          >
            <Icon className="size-3 shrink-0" strokeWidth={1.75} aria-hidden />
            {label}
          </li>
        );
      })}
    </ul>
  );
}
