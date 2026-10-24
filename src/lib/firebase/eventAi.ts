"use client";

import { getAI, getGenerativeModel, GoogleAIBackend, Schema } from "firebase/ai";
import { localeTrioFromPartial } from "@/i18n/localeMeta";
import { getFirebaseApp } from "@/lib/firebase/client";
import type { LocaleTrio } from "@/lib/publicEventTypes";

function localeObjectSchema() {
  return Schema.object({
    properties: {
      en: Schema.string(),
      es: Schema.string(),
      sv: Schema.string(),
      de: Schema.string(),
      fr: Schema.string(),
    },
  });
}

async function fileToInlinePart(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return {
    inlineData: {
      data: btoa(binary),
      mimeType: file.type || "image/jpeg",
    },
  };
}

export async function translateEventContent(input: {
  title: string;
  excerpt: string;
  imageFile?: File | null;
}): Promise<{ title: LocaleTrio; excerpt: LocaleTrio; imageAlt: LocaleTrio }> {
  const ai = getAI(getFirebaseApp(), { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
      responseSchema: Schema.object({
        properties: {
          title: localeObjectSchema(),
          excerpt: localeObjectSchema(),
          imageAlt: localeObjectSchema(),
        },
      }),
    },
  });

  const prompt = `You are the in-house copywriter for el PORTERO, a dinner club restaurant in Torrevieja, Spain (Peru, Spain, Sweden).

Translate the event title and description into Swedish (sv), English (en), Spanish (es), German (de), and French (fr).

Rules:
- Detect the source language. Keep that language natural; do not clumsily rephrase it unless needed for restaurant tone.
- Write natural marketing copy, not a word-for-word translation.
- Keep proper names unchanged: el PORTERO, Torrevieja, Magnus Hedman, and similar.
- Preserve line breaks in the description.
- imageAlt: one short accessible sentence per language describing the event photo. If no photo is attached, write a tasteful alt from the title/description (what a guest would see on a poster).
- Do not invent new facts (dates, prices, artists) that are not in the source.

Source title:
${input.title.trim()}

Source description:
${input.excerpt.trim()}`;

  const parts: Array<string | { inlineData: { data: string; mimeType: string } }> = [prompt];
  if (input.imageFile) {
    parts.push("A photo is attached. Describe that actual image in imageAlt for each language.");
    parts.push(await fileToInlinePart(input.imageFile));
  }

  const result = await model.generateContent(parts);
  const text = result.response.text();
  const parsed = JSON.parse(text) as {
    title?: unknown;
    excerpt?: unknown;
    imageAlt?: unknown;
  };

  return {
    title: localeTrioFromPartial(parsed.title),
    excerpt: localeTrioFromPartial(parsed.excerpt),
    imageAlt: localeTrioFromPartial(parsed.imageAlt),
  };
}
