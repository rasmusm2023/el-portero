import { useEffect, type RefObject } from "react";

/**
 * Calls `onAway` when the user clicks/taps outside `ref`.
 * When `enabled` is false, no listeners are registered.
 * Attaches the listener after a microtask so the same gesture that opened
 * a dropdown does not immediately count as an outside click.
 */
export function useClickAway(
  ref: RefObject<HTMLElement | null>,
  onAway: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    let remove: (() => void) | undefined;

    const id = window.setTimeout(() => {
      function handlePointerDown(e: PointerEvent) {
        const el = ref.current;
        if (!el || el.contains(e.target as Node)) return;
        onAway();
      }

      document.addEventListener("pointerdown", handlePointerDown, true);
      remove = () =>
        document.removeEventListener("pointerdown", handlePointerDown, true);
    }, 0);

    return () => {
      clearTimeout(id);
      remove?.();
    };
  }, [enabled, onAway, ref]);
}
