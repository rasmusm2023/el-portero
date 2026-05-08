/**
 * Firestore Admin-style reads/writes via HTTPS REST only — no `firebase-admin` / gRPC.
 * Keeps Netlify `___netlify-server-handler` under the 50MB zipped upload cap.
 *
 * @see https://firebase.google.com/docs/firestore/reference/rest
 */

import { createSign } from "node:crypto";
import { coercePublishedToBoolean, publishedFieldNeedsRepair } from "@/lib/publicEventPublishedCoercion";
import { PUBLIC_EVENTS_COLLECTION } from "@/lib/firebase/publicEventsConstants";

type ServiceAccountJson = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

type FirestoreRawValue = Record<string, unknown>;

let cachedToken: { token: string; expiresAtMs: number } | null = null;

function b64urlJson(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function signServiceAccountJwt(sa: Required<ServiceAccountJson>): string {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  const sign = createSign("RSA-SHA256");
  sign.update(unsigned);
  sign.end();
  const sig = sign.sign(sa.private_key);
  const encSig = Buffer.from(sig).toString("base64url");
  return `${unsigned}.${encSig}`;
}

async function fetchAccessToken(sa: Required<ServiceAccountJson>): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAtMs > now + 60_000) {
    return cachedToken.token;
  }

  const assertion = signServiceAccountJwt(sa);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OAuth token exchange failed: ${res.status} ${t.slice(0, 400)}`);
  }
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  const token = json.access_token;
  if (!token) throw new Error("OAuth token response missing access_token");
  const ttlSec = typeof json.expires_in === "number" ? json.expires_in : 3500;
  cachedToken = { token, expiresAtMs: now + ttlSec * 1000 };
  return token;
}

export function parseServiceAccountJson(raw: string): Required<ServiceAccountJson> | null {
  try {
    const sa = JSON.parse(raw) as ServiceAccountJson;
    const project_id = sa.project_id?.trim();
    const client_email = sa.client_email?.trim();
    const private_key = sa.private_key?.trim();
    if (!project_id || !client_email || !private_key) return null;
    return { project_id, client_email, private_key };
  } catch {
    return null;
  }
}

/** Decode Firestore REST `fields` map → plain JS (matches client SDK shapes closely enough for `homeEventFromFirestoreData`). */
export function decodeFirestoreFields(
  fields: Record<string, FirestoreRawValue> | undefined,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!fields) return out;
  for (const [k, v] of Object.entries(fields)) {
    out[k] = decodeFirestoreValue(v);
  }
  return out;
}

function decodeFirestoreValue(v: unknown): unknown {
  if (v == null || typeof v !== "object") return v;
  const o = v as Record<string, unknown>;
  if ("nullValue" in o) return null;
  if ("booleanValue" in o) return o.booleanValue;
  if ("stringValue" in o) return o.stringValue;
  if ("integerValue" in o) return o.integerValue;
  if ("doubleValue" in o) return o.doubleValue;
  if ("timestampValue" in o) return o.timestampValue;
  if ("geoPointValue" in o && o.geoPointValue && typeof o.geoPointValue === "object") return o.geoPointValue;
  if ("referenceValue" in o) return o.referenceValue;
  if ("arrayValue" in o) {
    const vals = (o.arrayValue as { values?: unknown[] } | undefined)?.values;
    return Array.isArray(vals) ? vals.map(decodeFirestoreValue) : [];
  }
  if ("mapValue" in o) {
    const f = (o.mapValue as { fields?: Record<string, FirestoreRawValue> } | undefined)?.fields;
    return decodeFirestoreFields(f);
  }
  return v;
}

function docIdFromName(name: string): string {
  const parts = name.split("/");
  return parts[parts.length - 1] ?? name;
}

async function firestorePostJson<T>(
  projectId: string,
  accessToken: string,
  pathSuffix: string,
  jsonBody: unknown,
): Promise<T> {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/${pathSuffix}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonBody),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Firestore REST ${pathSuffix} failed: ${res.status} ${t.slice(0, 600)}`);
  }
  return res.json() as Promise<T>;
}

type RunQueryRow = {
  document?: { name?: string; fields?: Record<string, FirestoreRawValue> };
};

export async function runQueryPublishedEvents(
  projectId: string,
  accessToken: string,
): Promise<{ id: string; data: Record<string, unknown> }[]> {
  const rows = await firestorePostJson<RunQueryRow[]>(
    projectId,
    accessToken,
    "documents:runQuery",
    {
      structuredQuery: {
        from: [{ collectionId: PUBLIC_EVENTS_COLLECTION }],
        where: {
          fieldFilter: {
            field: { fieldPath: "published" },
            op: "EQUAL",
            value: { booleanValue: true },
          },
        },
      },
    },
  );

  const out: { id: string; data: Record<string, unknown> }[] = [];
  for (const row of rows) {
    const doc = row.document;
    if (!doc?.name) continue;
    out.push({
      id: docIdFromName(doc.name),
      data: decodeFirestoreFields(doc.fields),
    });
  }
  return out;
}

/** All documents in `publicEvents` (for diagnostics / repair). */
export async function runQueryAllPublicEvents(
  projectId: string,
  accessToken: string,
): Promise<{ id: string; data: Record<string, unknown>; name: string }[]> {
  const rows = await firestorePostJson<RunQueryRow[]>(
    projectId,
    accessToken,
    "documents:runQuery",
    {
      structuredQuery: {
        from: [{ collectionId: PUBLIC_EVENTS_COLLECTION }],
      },
    },
  );

  const out: { id: string; data: Record<string, unknown>; name: string }[] = [];
  for (const row of rows) {
    const doc = row.document;
    if (!doc?.name) continue;
    out.push({
      id: docIdFromName(doc.name),
      name: doc.name,
      data: decodeFirestoreFields(doc.fields),
    });
  }
  return out;
}

export async function repairMisalignedPublishedFieldsRest(
  projectId: string,
  accessToken: string,
): Promise<number> {
  const docs = await runQueryAllPublicEvents(projectId, accessToken);
  const writes: unknown[] = [];

  for (const d of docs) {
    const p = d.data.published;
    if (!publishedFieldNeedsRepair(p)) continue;
    writes.push({
      update: {
        name: d.name,
        fields: {
          published: { booleanValue: coercePublishedToBoolean(p) },
        },
      },
      updateMask: { fieldPaths: ["published"] },
    });
  }

  if (writes.length === 0) return 0;

  let updated = 0;
  const chunkSize = 400;
  for (let i = 0; i < writes.length; i += chunkSize) {
    const slice = writes.slice(i, i + chunkSize);
    await firestorePostJson(
      projectId,
      accessToken,
      "documents:commit",
      { writes: slice },
    );
    updated += slice.length;
  }
  return updated;
}

export async function getDatastoreAccessToken(rawServiceAccountJson: string): Promise<{
  projectId: string;
  token: string;
} | null> {
  const sa = parseServiceAccountJson(rawServiceAccountJson);
  if (!sa) return null;
  const token = await fetchAccessToken(sa);
  return { projectId: sa.project_id, token };
}
