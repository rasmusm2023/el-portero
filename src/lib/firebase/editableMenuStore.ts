import {
  doc,
  getDoc,
  onSnapshot,
  type Firestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  migrateLegacyDietaryString,
  normalizeDietaryTagIds,
  type DietaryTagId,
} from "@/lib/dietaryTags";
import type { EditableMenuDoc, EditableMenuKind } from "@/lib/editableMenuTypes";

export const EDITABLE_MENUS_COLLECTION = "editableMenus";

export function editableMenuRef(db: Firestore, kind: EditableMenuKind) {
  return doc(db, EDITABLE_MENUS_COLLECTION, kind);
}

function normalizeItemDietaryTags(item: Record<string, unknown>): DietaryTagId[] {
  if (Array.isArray(item.dietaryTagIds)) {
    return normalizeDietaryTagIds(item.dietaryTagIds);
  }
  if (typeof item.dietaryTags === "string" && item.dietaryTags.trim()) {
    return migrateLegacyDietaryString(item.dietaryTags);
  }
  return [];
}

function normalizeDoc(raw: Record<string, unknown> | undefined): EditableMenuDoc | null {
  if (!raw || typeof raw !== "object") return null;
  const title = typeof raw.title === "string" ? raw.title : "";
  const isPublished = Boolean(raw.isPublished);
  const updatedAtUtc =
    typeof raw.updatedAtUtc === "string"
      ? raw.updatedAtUtc
      : typeof raw.updatedAt === "string"
        ? raw.updatedAt
        : undefined;

  const catsIn = Array.isArray(raw.categories) ? raw.categories : [];
  const categories = catsIn.map((c, ci) => {
    const row = c as Record<string, unknown>;
    const itemsIn = Array.isArray(row.items) ? row.items : [];
    const items = itemsIn.map((it, ii) => {
      const item = it as Record<string, unknown>;
      const dietaryTagIds = normalizeItemDietaryTags(item);
      return {
        position: typeof item.position === "number" ? item.position : ii,
        name: typeof item.name === "string" ? item.name : "",
        description: typeof item.description === "string" ? item.description : "",
        price: typeof item.price === "string" ? item.price : "",
        dietaryTagIds,
      };
    });
    items.sort((a, b) => a.position - b.position);
    return {
      position: typeof row.position === "number" ? row.position : ci,
      title: typeof row.title === "string" ? row.title : "",
      items,
    };
  });
  categories.sort((a, b) => a.position - b.position);

  return {
    title,
    isPublished,
    updatedAtUtc,
    categories,
  };
}

export async function readEditableMenu(
  db: Firestore,
  kind: EditableMenuKind,
): Promise<EditableMenuDoc | null> {
  const snap = await getDoc(editableMenuRef(db, kind));
  if (!snap.exists()) return null;
  return normalizeDoc(snap.data() as Record<string, unknown>);
}

export function subscribeEditableMenu(
  db: Firestore,
  kind: EditableMenuKind,
  onValue: (menu: EditableMenuDoc | null) => void,
  onError?: (err: unknown) => void,
): () => void {
  return onSnapshot(
    editableMenuRef(db, kind),
    (snap) => {
      if (!snap.exists()) {
        onValue(null);
        return;
      }
      onValue(normalizeDoc(snap.data() as Record<string, unknown>));
    },
    (err) => onError?.(err),
  );
}

export async function upsertEditableMenu(db: Firestore, kind: EditableMenuKind, menu: EditableMenuDoc) {
  await setDoc(
    editableMenuRef(db, kind),
    {
      title: menu.title ?? "",
      isPublished: Boolean(menu.isPublished),
      categories: menu.categories ?? [],
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function setEditableMenuPublished(
  db: Firestore,
  kind: EditableMenuKind,
  isPublished: boolean,
) {
  await setDoc(
    editableMenuRef(db, kind),
    {
      isPublished: Boolean(isPublished),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
