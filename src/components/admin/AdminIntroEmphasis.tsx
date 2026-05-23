import type { ReactNode } from "react";

/**
 * Renders admin help copy with `**phrase**` markers as bold + italic highlights
 * (matches button labels staff should look for).
 */
export function AdminIntroEmphasis({ text }: { text: string }): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong
        key={i}
        className="font-semibold italic text-paper"
      >
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
