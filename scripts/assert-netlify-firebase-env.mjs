/**
 * Netlify sets NETLIFY=true during `next build`. If Firebase client env is missing at
 * build time, NEXT_PUBLIC_* are inlined as empty → admin shows "not configured" forever.
 * Failing here surfaces mis-scoped or missing Netlify env vars in the deploy log.
 */
if (process.env.NETLIFY !== "true") {
  process.exit(0);
}

const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const missing = required.filter((k) => !String(process.env[k] ?? "").trim());

if (missing.length > 0) {
  console.error(
    "\n[el-portero] Netlify build: missing required Firebase env (NEXT_PUBLIC_*):",
    missing.join(", "),
  );
  console.error(
    "[el-portero] In Netlify: Site configuration → Environment variables — use exact names, scope must include this deploy (e.g. Production). Then Deploys → Trigger deploy → Clear cache and deploy site.\n",
  );
  process.exit(1);
}

process.exit(0);
