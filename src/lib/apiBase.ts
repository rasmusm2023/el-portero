export function getApiBaseUrl() {
  // Keep this super simple for now: local dev backend.
  // Later you can swap to env vars (NEXT_PUBLIC_API_BASE_URL) when deploying.
  // `??` does not treat "" as missing — an empty env would make fetch hit the Next (same-origin) `/api/...` and 404.
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : "http://localhost:5057";
}

