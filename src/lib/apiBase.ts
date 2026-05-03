/** Base URL for the .NET admin API (login, lunch publish, events CRUD, media). Public lunch/events use `src/data/*` instead. */
export function getApiBaseUrl() {
  // `??` does not treat "" as missing — an empty env would make fetch hit the Next (same-origin) `/api/...` and 404.
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : "http://localhost:5057";
}

