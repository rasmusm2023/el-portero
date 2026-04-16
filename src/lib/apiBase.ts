export function getApiBaseUrl() {
  // Keep this super simple for now: local dev backend.
  // Later you can swap to env vars (NEXT_PUBLIC_API_BASE_URL) when deploying.
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5057";
}

