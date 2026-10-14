import type { PropsWithChildren } from "react";

/**
 * Route segment wrapper. Content stays visible on first paint — an enter fade from
 * opacity 0 delayed the hero and the wordmark until the animation finished.
 */
export default function Template({ children }: PropsWithChildren) {
  return <div className="flex min-h-0 flex-1 flex-col">{children}</div>;
}
