"use client";

import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseAuth, getFirebaseStorage } from "@/lib/firebase/client";

const EVENT_IMAGE_PREFIX = "event-images/";
/** Longest side on the website cards — enough for retina, small enough to stay light. */
const MAX_EDGE = 1600;
/** Soft cap after resize; quality steps down until we land under this. */
const TARGET_BYTES = 420_000;
const QUALITY_STEPS = [0.82, 0.74, 0.66] as const;

export function isManagedEventImagePath(path: string | undefined): boolean {
  return Boolean(path?.startsWith(EVENT_IMAGE_PREFIX));
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (next) => (next ? resolve(next) : reject(new Error("Could not compress the photo."))),
      "image/jpeg",
      quality,
    );
  });
}

/**
 * Runs in the browser on save — staff just pick a photo.
 * Downscales to {@link MAX_EDGE} and writes JPEG, stepping quality down if the file is still heavy.
 * Keeps the original when it is already a small enough JPEG.
 */
export async function compressEventImage(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const isJpeg = /image\/jpe?g/i.test(file.type);
    if (scale === 1 && isJpeg && file.size <= TARGET_BYTES) {
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not compress the photo.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);

    let best: Blob | null = null;
    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToJpeg(canvas, quality);
      best = blob;
      if (blob.size <= TARGET_BYTES) break;
    }
    if (!best) throw new Error("Could not compress the photo.");

    if (isJpeg && scale === 1 && file.size <= best.size) {
      return file;
    }
    return best;
  } finally {
    bitmap.close();
  }
}

export async function uploadEventImage(file: File): Promise<{ url: string; path: string }> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) throw new Error("Sign in again to upload a photo.");
  const blob = await compressEventImage(file);
  const path = `${EVENT_IMAGE_PREFIX}${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const storageRef = ref(getFirebaseStorage(), path);
  await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function deleteEventImageIfManaged(path: string | undefined): Promise<void> {
  if (!isManagedEventImagePath(path) || !path) return;
  try {
    await deleteObject(ref(getFirebaseStorage(), path));
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? String((err as { code?: string }).code) : "";
    if (code.includes("object-not-found")) return;
    console.warn("[eventImageStorage] Could not delete photo:", path, err);
  }
}
