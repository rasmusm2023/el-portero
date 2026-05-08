import { NextResponse } from "next/server";
import {
  getDatastoreAccessToken,
  repairMisalignedPublishedFieldsRest,
  runQueryAllPublicEvents,
  runQueryPublishedEvents,
} from "@/lib/firebase/firestoreRest";
import { homeEventFromFirestoreData } from "@/lib/firebase/publicEventDoc";

export const dynamic = "force-dynamic";

/** One-time per Node process: same boolean coercion as opening Admin → Events (client `updateDoc`). */
let bootstrapPublicEventsRepairDone = false;
let warnedMissingServiceAccount = false;

/**
 * Published public events via Firestore REST + OAuth (no `firebase-admin` / gRPC — fits Netlify limits).
 * When `FIREBASE_SERVICE_ACCOUNT_JSON` is unset, returns `[]` with 200; the browser still uses Firestore first.
 */
export async function GET() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  const session = raw ? await getDatastoreAccessToken(raw) : null;

  if (!session) {
    if (!warnedMissingServiceAccount) {
      warnedMissingServiceAccount = true;
      console.warn(
        "[api/public/events] FIREBASE_SERVICE_ACCOUNT_JSON is not set — this route returns []. " +
          "Anonymous /events then relies only on the browser Firestore listener. " +
          "Set the service account on your host so the API can list + repair `published` field types. " +
          "Troubleshooting: GET /api/public/events/diagnostics (dev) or ?key=EVENTS_DIAGNOSTICS_SECRET",
      );
    }
    return NextResponse.json([]);
  }

  const { projectId, token } = session;

  try {
    if (!bootstrapPublicEventsRepairDone) {
      bootstrapPublicEventsRepairDone = true;
      try {
        const fixed = await repairMisalignedPublishedFieldsRest(projectId, token);
        if (fixed > 0) {
          console.info(
            `[api/public/events] Bootstrap repair wrote boolean \`published\` on ${fixed} document(s).`,
          );
        }
      } catch (repairErr) {
        bootstrapPublicEventsRepairDone = false;
        console.warn("[api/public/events] Bootstrap repair failed (will retry next request):", repairErr);
      }
    }

    let rows = await runQueryPublishedEvents(projectId, token);
    if (rows.length === 0) {
      const any = await runQueryAllPublicEvents(projectId, token);
      if (any.length > 0) {
        const fixed = await repairMisalignedPublishedFieldsRest(projectId, token);
        if (fixed > 0) {
          rows = await runQueryPublishedEvents(projectId, token);
        }
      }
    }

    const events = rows
      .map((r) => homeEventFromFirestoreData(r.id, r.data))
      .sort((a, b) => a.sortDate.localeCompare(b.sortDate));

    return NextResponse.json(events);
  } catch (e) {
    console.error("[api/public/events]", e);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}
