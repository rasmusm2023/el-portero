import { NextResponse } from "next/server";
import {
  getDatastoreAccessToken,
  parseServiceAccountJson,
  runQueryAllPublicEvents,
  runQueryPublishedEvents,
} from "@/lib/firebase/firestoreRest";
import { publishedFieldNeedsRepair } from "@/lib/publicEventPublishedCoercion";
import { PUBLIC_EVENTS_COLLECTION } from "@/lib/firebase/publicEventsConstants";

export const dynamic = "force-dynamic";

function authorizeDiagnostics(req: Request): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const secret = process.env.EVENTS_DIAGNOSTICS_SECRET?.trim();
  if (!secret) return false;
  const url = new URL(req.url);
  const key = url.searchParams.get("key")?.trim();
  return key === secret || req.headers.get("x-events-diagnostics") === secret;
}

/**
 * Safe Firestore shape check for `publicEvents` (no document body content).
 *
 * - **Development:** open `GET /api/public/events/diagnostics` with no auth.
 * - **Production:** set `EVENTS_DIAGNOSTICS_SECRET` and call `?key=...` or header `x-events-diagnostics`.
 */
export async function GET(req: Request) {
  if (!authorizeDiagnostics(req)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  const base: Record<string, unknown> = {
    ok: true,
    adminFirestoreConfigured: Boolean(raw && parseServiceAccountJson(raw)),
    nextPublicFirebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? null,
    nodeEnv: process.env.NODE_ENV,
  };

  if (!raw) {
    base.recommendation =
      "Set FIREBASE_SERVICE_ACCOUNT_JSON on the server. Without it, GET /api/public/events returns [] and anonymous tabs cannot get the bootstrap `published` boolean repair.";
    return NextResponse.json(base);
  }

  const session = await getDatastoreAccessToken(raw);
  if (!session) {
    base.ok = false;
    base.recommendation = "FIREBASE_SERVICE_ACCOUNT_JSON could not be parsed or OAuth failed.";
    return NextResponse.json(base);
  }

  const { projectId, token } = session;

  try {
    const all = await runQueryAllPublicEvents(projectId, token);
    const publishedRows = await runQueryPublishedEvents(projectId, token);

    const samples = all.slice(0, 30).map((d) => {
      const p = d.data.published;
      return {
        id: d.id,
        publishedJsType: p === null || p === undefined ? "nullish" : typeof p,
        publishedNeedsBooleanRepair: publishedFieldNeedsRepair(p),
        sortDatePresent: d.data.sortDate != null && String(d.data.sortDate).length > 0,
      };
    });

    const repairable = samples.filter((s) => s.publishedNeedsBooleanRepair).length;
    let recommendation = "Firestore REST + OAuth reachable.";
    if (repairable > 0) {
      recommendation = `${repairable} doc(s) have non-boolean \`published\`. First GET /api/public/events runs bootstrap repair; visiting Admin → Events also fixes via client updateDoc.`;
    } else if (publishedRows.length === 0 && all.length > 0) {
      recommendation =
        "Documents exist but `where(published==true)` returns none — fields may be missing `published`, or values are not boolean `true` (repair should have run on /api/public/events).";
    } else if (all.length === 0) {
      recommendation = "Collection is empty.";
    }

    return NextResponse.json({
      ...base,
      collection: PUBLIC_EVENTS_COLLECTION,
      totalDocuments: all.length,
      publishedBooleanTrueQueryCount: publishedRows.length,
      sampleDocuments: samples,
      recommendation,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
