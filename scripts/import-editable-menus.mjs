#!/usr/bin/env node
/**
 * Mass-import editable menus into Firestore.
 *
 * Reads CSVs from `scripts/menu-content/{kind}.csv` (dinner, drinks) and writes one
 * Firestore doc per menu kind at `editableMenus/{kind}`. By default everything is
 * imported with `isPublished: false` — review in `/admin/menus` and Publish from the UI.
 *
 * Auth: uses `FIREBASE_SERVICE_ACCOUNT_JSON` from `.env.local` (same secret the rest of
 * the app uses for server-side Firestore). REST-only — no `firebase-admin` dep needed.
 *
 * Usage:
 *   node scripts/import-editable-menus.mjs                # import both (kept unpublished)
 *   node scripts/import-editable-menus.mjs dinner         # import a single menu
 *   node scripts/import-editable-menus.mjs --publish      # import + publish immediately
 *   node scripts/import-editable-menus.mjs --dry-run      # parse + validate only, no write
 *
 * CSV columns (header row required):
 *   section, name, description, price, dietary_tags, allergens
 *   Optional column: name_extension — second line under the dish name (same styling, smaller type).
 *
 *   - section       : section title (e.g. "To begin"). Rows sharing a section stay grouped.
 *                     Order in the file is preserved. Section order follows first appearance.
 *   - name          : dish name (required).
 *   - name_extension: optional subtitle / suffix line (e.g. region, vintage). Omit column or leave blank.
 *   - description   : optional. Multi-line allowed (use double-quotes per RFC 4180).
 *   - price         : numeric string — "24", "24.5", or blank. No currency symbol; the
 *                     public menu page renders "All prices in euros (€)" once at the top.
 *
 *                     Size variants (drinks only): use a pipe-separated list of
 *                     "label=price" pairs to show multiple sizes on one line, e.g.
 *                       Small=4|Large=6
 *                       33cl=4.5|50cl=6.5
 *                       Glass=7|Bottle=32
 *                     When size variants are set, the single-price slot is ignored.
 *   - dietary_tags  : semicolon-separated ids; subset of:
 *                       alcoholFree, vegan, vegetarian, glutenFree, lactoseFree
 *   - allergens     : semicolon-separated EU Annex II numbers 1-14 (e.g. "1;3;7").
 *                     Only used for the dinner menu (ignored for drinks).
 *
 * Optional first row: `# title: Spring dinner 2026` — sets the page heading.
 */

import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createSign } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const CONTENT_DIR = join(__dirname, "menu-content");

const ALLOWED_KINDS = ["dinner", "drinks"];
const DIETARY_IDS = ["alcoholFree", "vegan", "vegetarian", "glutenFree", "lactoseFree"];
const ALLERGEN_NUMBER_TO_ID = {
  1: "gluten",
  2: "crustaceans",
  3: "eggs",
  4: "fish",
  5: "peanuts",
  6: "soy",
  7: "milk",
  8: "nuts",
  9: "celery",
  10: "mustard",
  11: "sesame",
  12: "sulphites",
  13: "lupin",
  14: "molluscs",
};

// ---------- CLI ----------

function parseArgs(argv) {
  const args = { kinds: [], publish: false, dryRun: false };
  for (const a of argv.slice(2)) {
    if (a === "--publish") args.publish = true;
    else if (a === "--dry-run" || a === "--dry") args.dryRun = true;
    else if (ALLOWED_KINDS.includes(a)) args.kinds.push(a);
    else if (a.startsWith("--")) throw new Error(`Unknown flag: ${a}`);
    else throw new Error(`Unknown menu kind: ${a}. Allowed: ${ALLOWED_KINDS.join(", ")}`);
  }
  if (args.kinds.length === 0) args.kinds = [...ALLOWED_KINDS];
  return args;
}

// ---------- .env.local loader ----------

/**
 * Minimal KEY=VALUE / KEY="VALUE" parser (mirrors standard dotenv behaviour).
 * Only interprets `\n` / `\r` / `\t` inside DOUBLE-quoted values — unquoted values are
 * passed through literally so an inline JSON blob (with embedded `\n` inside the
 * `private_key` string) survives intact for `JSON.parse` later.
 */
function loadDotEnvLocal() {
  const envPath = join(REPO_ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    const wasDoubleQuoted = val.length >= 2 && val.startsWith('"') && val.endsWith('"');
    const wasSingleQuoted = val.length >= 2 && val.startsWith("'") && val.endsWith("'");
    if (wasDoubleQuoted || wasSingleQuoted) {
      val = val.slice(1, -1);
    }
    if (wasDoubleQuoted) {
      val = val.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t");
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

// ---------- CSV parser (RFC 4180-ish, supports quoted multi-line values) ----------

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let i = 0;
  let inQuotes = false;
  const len = text.length;
  while (i < len) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cur += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      row.push(cur);
      cur = "";
      i++;
      continue;
    }
    if (ch === "\r") {
      i++;
      continue;
    }
    if (ch === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
      i++;
      continue;
    }
    cur += ch;
    i++;
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

// ---------- File → EditableMenuDoc ----------

function parseDietary(raw, ctx) {
  if (!raw) return [];
  const out = [];
  for (const part of raw.split(";").map((s) => s.trim()).filter(Boolean)) {
    if (!DIETARY_IDS.includes(part)) {
      throw new Error(
        `${ctx}: unknown dietary tag "${part}" (allowed: ${DIETARY_IDS.join(", ")})`,
      );
    }
    if (!out.includes(part)) out.push(part);
  }
  return out;
}

function parseAllergens(raw, kind, ctx) {
  if (!raw) return [];
  if (kind === "drinks") return [];
  const out = [];
  for (const part of raw.split(";").map((s) => s.trim()).filter(Boolean)) {
    const n = Number(part);
    if (!Number.isInteger(n) || n < 1 || n > 14) {
      throw new Error(`${ctx}: allergen "${part}" must be an integer 1–14`);
    }
    const id = ALLERGEN_NUMBER_TO_ID[n];
    if (!out.includes(id)) out.push(id);
  }
  return out;
}

const NUMERIC_PRICE_RE = /^\d+(\.\d{1,2})?$/;

/**
 * Parses the `price` CSV column. Returns `{ price, priceOptions }`:
 *   - single price → `{ price: "24", priceOptions: [] }`
 *   - size variants → `{ price: "", priceOptions: [{ label, price }, ...] }`
 *
 * Size-variant syntax: `Label=Price|Label=Price` (pipe-separated, `=` inside each pair).
 * Allowed only on the drinks menu — using it on dinner throws so the format error
 * surfaces during dry-run instead of silently turning every drink option into a label
 * row on a food item.
 */
function parsePrice(raw, kind, ctx) {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return { price: "", priceOptions: [] };

  if (trimmed.includes("|") || trimmed.includes("=")) {
    if (kind !== "drinks") {
      throw new Error(
        `${ctx}: size-variant prices ("Label=Price|...") are only allowed on the drinks menu.`,
      );
    }
    const priceOptions = [];
    for (const part of trimmed.split("|").map((s) => s.trim()).filter(Boolean)) {
      const eq = part.indexOf("=");
      if (eq === -1) {
        throw new Error(
          `${ctx}: size variant "${part}" must use Label=Price (e.g. Small=4).`,
        );
      }
      const label = part.slice(0, eq).trim();
      const price = part.slice(eq + 1).trim();
      if (!label) throw new Error(`${ctx}: size variant "${part}" is missing a label.`);
      if (!NUMERIC_PRICE_RE.test(price)) {
        throw new Error(
          `${ctx}: size variant "${part}" price "${price}" must be a plain number like 4 or 4.50.`,
        );
      }
      priceOptions.push({ label, price });
    }
    if (priceOptions.length === 0) {
      throw new Error(`${ctx}: empty size-variant list "${trimmed}".`);
    }
    return { price: "", priceOptions };
  }

  if (!NUMERIC_PRICE_RE.test(trimmed)) {
    throw new Error(
      `${ctx}: price "${trimmed}" must be a plain number like 24 or 24.50 (no € symbol).`,
    );
  }
  return { price: trimmed, priceOptions: [] };
}

async function buildDocFromCsv(kind) {
  const csvPath = join(CONTENT_DIR, `${kind}.csv`);
  if (!existsSync(csvPath)) {
    throw new Error(`Missing menu file: ${csvPath}`);
  }
  const raw = await readFile(csvPath, "utf8");

  let title = "";
  let body = raw;
  const titleMatch = raw.match(/^#\s*title:\s*(.+)$/im);
  if (titleMatch) {
    title = titleMatch[1].trim();
    body = raw.replace(titleMatch[0], "");
  }
  body = body.replace(/^(\s*#[^\n]*\n)+/, "");

  const rows = parseCsv(body).filter((r) => r.some((c) => (c ?? "").trim() !== ""));
  if (rows.length === 0) throw new Error(`${kind}.csv has no rows`);

  const header = rows[0].map((c) => c.trim().toLowerCase());
  const required = ["section", "name", "description", "price", "dietary_tags", "allergens"];
  for (const col of required) {
    if (!header.includes(col)) {
      throw new Error(`${kind}.csv missing required column "${col}" — got: ${header.join(", ")}`);
    }
  }
  const colIdx = Object.fromEntries(required.map((c) => [c, header.indexOf(c)]));
  const nameExtensionCol = header.indexOf("name_extension");

  /** @type {Map<string, { position: number; title: string; items: any[] }>} */
  const sectionsByTitle = new Map();
  const sectionOrder = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const ctx = `${kind}.csv line ${r + 1}`;
    const section = (row[colIdx.section] ?? "").trim();
    const name = (row[colIdx.name] ?? "").trim();
    if (!section && !name) continue;
    if (!section) throw new Error(`${ctx}: missing section`);
    if (!name) throw new Error(`${ctx}: missing dish name`);

    if (!sectionsByTitle.has(section)) {
      sectionsByTitle.set(section, {
        position: sectionOrder.length,
        title: section,
        items: [],
      });
      sectionOrder.push(section);
    }
    const sec = sectionsByTitle.get(section);

    const description = (row[colIdx.description] ?? "").trim();
    const nameExtension =
      nameExtensionCol >= 0 ? (row[nameExtensionCol] ?? "").trim() : "";
    const { price, priceOptions } = parsePrice(row[colIdx.price], kind, ctx);
    const dietaryTagIds = parseDietary(row[colIdx.dietary_tags], ctx);
    const allergenIds = parseAllergens(row[colIdx.allergens], kind, ctx);

    sec.items.push({
      position: sec.items.length,
      name,
      nameExtension,
      description,
      price,
      priceOptions,
      dietaryTagIds,
      allergenIds,
    });
  }

  return {
    title,
    categories: sectionOrder.map((t) => sectionsByTitle.get(t)),
  };
}

// ---------- Firestore REST ----------

function b64urlJson(obj) {
  return Buffer.from(JSON.stringify(obj), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function signServiceAccountJwt(sa) {
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

async function fetchAccessToken(sa) {
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
  const json = await res.json();
  if (!json.access_token) throw new Error("OAuth response missing access_token");
  return json.access_token;
}

function parseServiceAccountJson(raw) {
  if (!raw) return null;
  let sa;
  try {
    sa = JSON.parse(raw);
  } catch {
    return null;
  }
  const project_id = sa.project_id?.trim();
  const client_email = sa.client_email?.trim();
  const private_key = sa.private_key?.trim();
  if (!project_id || !client_email || !private_key) return null;
  return { project_id, client_email, private_key };
}

// ---------- Firestore value encoder ----------

function encodeValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  if (typeof v === "string") return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(encodeValue) } };
  if (typeof v === "object") return { mapValue: { fields: encodeFields(v) } };
  return { stringValue: String(v) };
}

function encodeFields(obj) {
  const out = {};
  for (const [k, val] of Object.entries(obj)) out[k] = encodeValue(val);
  return out;
}

async function patchEditableMenu(projectId, accessToken, kind, doc, publish) {
  const fields = encodeFields({
    title: doc.title ?? "",
    isPublished: Boolean(publish),
    categories: doc.categories,
    updatedAt: new Date().toISOString(),
  });
  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    `/databases/(default)/documents/editableMenus/${kind}` +
    `?updateMask.fieldPaths=title&updateMask.fieldPaths=isPublished` +
    `&updateMask.fieldPaths=categories&updateMask.fieldPaths=updatedAt`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Firestore PATCH editableMenus/${kind} failed: ${res.status} ${t.slice(0, 600)}`);
  }
}

// ---------- main ----------

function summarize(kind, doc) {
  const sections = doc.categories.length;
  const items = doc.categories.reduce((n, c) => n + c.items.length, 0);
  const title = doc.title ? ` — "${doc.title}"` : "";
  return `${kind}: ${sections} section(s), ${items} dish(es)${title}`;
}

async function main() {
  const args = parseArgs(process.argv);
  loadDotEnvLocal();

  const built = {};
  for (const kind of args.kinds) {
    built[kind] = await buildDocFromCsv(kind);
    console.log(`✓ parsed ${summarize(kind, built[kind])}`);
  }

  if (args.dryRun) {
    console.log("\nDry run — nothing written.");
    return;
  }

  const sa = parseServiceAccountJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!sa) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_JSON in .env.local (paste the entire service account JSON, single-line).",
    );
  }
  console.log(`\nAuthenticating to project: ${sa.project_id}`);
  const accessToken = await fetchAccessToken(sa);

  for (const kind of args.kinds) {
    await patchEditableMenu(sa.project_id, accessToken, kind, built[kind], args.publish);
    console.log(
      `✓ wrote editableMenus/${kind} (isPublished=${args.publish ? "true" : "false"})`,
    );
  }

  console.log("\nDone.");
  if (!args.publish) {
    console.log("Tip: review at /admin/menus, then click Publish to make each menu live.");
  }
}

main().catch((err) => {
  console.error("\nImport failed:", err.message || err);
  process.exitCode = 1;
});
