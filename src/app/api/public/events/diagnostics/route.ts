import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/adminNode";
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

  const db = getAdminFirestore();
  const base: Record<string, unknown> = {
    ok: true,
    adminFirestoreConfigured: Boolean(db),
    nextPublicFirebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? null,
    nodeEnv: process.env.NODE_ENV,
  };

  if (!db) {
    base.recommendation =
      "Set FIREBASE_SERVICE_ACCOUNT_JSON on the server. Without it, GET /api/public/events returns [] and anonymous tabs cannot get the bootstrap `published` boolean repair.";
    return NextResponse.json(base);
  }

  try {
    const all = await db.collection(PUBLIC_EVENTS_COLLECTION).get();
    const publishedTrue = await db.collection(PUBLIC_EVENTS_COLLECTION).where("published", "==", true).get();

    const samples = all.docs.slice(0, 30).map((d) => {
      const p = d.get("published");
      const sd = d.get("sortDate");
      return {
        id: d.id,
        publishedJsType: p === null || p === undefined ? "nullish" : typeof p,
        publishedNeedsBooleanRepair: publishedFieldNeedsRepair(p),
        sortDatePresent: sd != null && String(sd).length > 0,
      };
    });

    const repairable = samples.filter((s) => s.publishedNeedsBooleanRepair).length;
    let recommendation = "Firestore + Admin SDK reachable.";
    if (repairable > 0) {
      recommendation = `${repairable} doc(s) have non-boolean \`published\`. First GET /api/public/events runs bootstrap repair; visiting Admin → Events also fixes via client updateDoc.`;
    } else if (publishedTrue.size === 0 && all.size > 0) {
      recommendation =
        "Documents exist but `where(published==true)` returns none — fields may be missing `published`, or values are not boolean `true` (repair should have run on /api/public/events).";
    } else if (all.size === 0) {
      recommendation = "Collection is empty.";
    }

    return NextResponse.json({
      ...base,
      collection: PUBLIC_EVENTS_COLLECTION,
      totalDocuments: all.size,
      publishedBooleanTrueQueryCount: publishedTrue.size,
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
