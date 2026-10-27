/** Each stored event keeps a photo. Eight is the maximum. */
export const MAX_STORED_EVENTS = 8;

/**
 * Design preview. While this is true the full-list warning is always shown
 * and the New event button stays disabled with it. Saving or duplicating
 * an event still works until this is turned off.
 * Set to false after the design is accepted so the warning and the block follow
 * the real stored count. The eight slots in the list always follow the real count.
 */
export const PREVIEW_EVENT_STORAGE_WARNING = true;

export type EventStorageLimitState = {
  showWarning: boolean;
  /** Refuse a new or duplicated event. Stays off during the design preview. */
  blockNewEvents: boolean;
  /** Count drawn in the warning. The preview always shows the full cap. */
  displayCount: number;
};

export function eventStorageLimitState(storedCount: number): EventStorageLimitState {
  const atCap = storedCount >= MAX_STORED_EVENTS;
  if (PREVIEW_EVENT_STORAGE_WARNING) {
    return {
      showWarning: true,
      blockNewEvents: false,
      displayCount: MAX_STORED_EVENTS,
    };
  }
  return {
    showWarning: atCap,
    blockNewEvents: atCap,
    displayCount: storedCount,
  };
}

export function fillEventStorageMessage(template: string, count: number): string {
  return template
    .replaceAll("{count}", String(count))
    .replaceAll("{max}", String(MAX_STORED_EVENTS));
}
