import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/adminNode";
import { repairMisalignedPublishedFields } from "@/lib/firebase/publicEventsRepair";
import { homeEventFromFirestoreData } from "@/lib/firebase/publicEventDoc";
import { PUBLIC_EVENTS_COLLECTION } from "@/lib/firebase/publicEventsConstants";

export const dynamic = "force-dynamic";

/** One-time per Node process: same boolean coercion as opening Admin → Events (client `updateDoc`). */
let bootstrapPublicEventsRepairDone = false;
let warnedMissingServiceAccount = false;

async function loadPublishedBooleanTrue(db: NonNullable<ReturnType<typeof getAdminFirestore>>) {
  const snap = await db.collection(PUBLIC_EVENTS_COLLECTION).where("published", "==", true).get();
  const events = snap.docs.map((d) => homeEventFromFirestoreData(d.id, d.data() as Record<string, unknown>));
  events.sort((a, b) => a.sortDate.localeCompare(b.sortDate));
  return events;
}

/**
 * Published public events (Admin SDK). When `FIREBASE_SERVICE_ACCOUNT_JSON` is unset, returns `[]`
 * with 200 so dev logs stay quiet; the browser still uses Firestore first (`usePublicEvents`).
 *
 * If the strict `published == true` query is empty but the collection has documents, runs a one-time
 * coercion pass for non-boolean `published` values (Console imports / legacy docs), then retries the query.
 *
 * On the **first** successful Admin connection per server instance, runs that repair proactively so
 * anonymous visitors do not depend on someone opening the admin Events editor first.
 */
export async function GET() {
  const db = getAdminFirestore();
  if (!db) {
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

  try {
    if (!bootstrapPublicEventsRepairDone) {
      bootstrapPublicEventsRepairDone = true;
      try {
        const fixed = await repairMisalignedPublishedFields(db);
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

    let events = await loadPublishedBooleanTrue(db);
    if (events.length === 0) {
      const anySnap = await db.collection(PUBLIC_EVENTS_COLLECTION).limit(1).get();
      if (!anySnap.empty) {
        const fixed = await repairMisalignedPublishedFields(db);
        if (fixed > 0) {
          events = await loadPublishedBooleanTrue(db);
        }
      }
    }
    return NextResponse.json(events);
  } catch (e) {
    console.error("[api/public/events]", e);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}
