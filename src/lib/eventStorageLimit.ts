/** Each stored event keeps a photo. Ten is the maximum. */
export const MAX_STORED_EVENTS = 10;

/**
 * Temporary design preview. While this is true the full-list warning is always
 * shown, as if 10 events are stored. Set to false so the warning follows the
 * real stored count.
 */
export const PREVIEW_EVENT_STORAGE_WARNING = true;

export type EventStorageLimitState = {
  /** The list is at the maximum, so staff need to delete an event. */
  showWarning: boolean;
  /** Refuse a new or duplicated event. */
  blockNewEvents: boolean;
  /** Count drawn in the warning. */
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
