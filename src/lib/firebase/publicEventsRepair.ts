import type { Firestore } from "firebase-admin/firestore";
import { PUBLIC_EVENTS_COLLECTION } from "@/lib/firebase/publicEventsConstants";
import { coercePublishedToBoolean, publishedFieldNeedsRepair } from "@/lib/publicEventPublishedCoercion";

/**
 * Writes boolean `published` for any document that does not already store a boolean.
 * Returns how many documents were updated.
 */
export async function repairMisalignedPublishedFields(db: Firestore): Promise<number> {
  const snap = await db.collection(PUBLIC_EVENTS_COLLECTION).get();
  if (snap.empty) return 0;

  let pending = 0;
  let batch = db.batch();
  let updated = 0;

  const commitBatch = async () => {
    if (pending === 0) return;
    await batch.commit();
    batch = db.batch();
    pending = 0;
  };

  for (const d of snap.docs) {
    const p = d.get("published");
    if (!publishedFieldNeedsRepair(p)) continue;
    batch.update(d.ref, { published: coercePublishedToBoolean(p) });
    pending++;
    updated++;
    if (pending >= 450) await commitBatch();
  }
  await commitBatch();
  return updated;
}
