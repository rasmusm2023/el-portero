"use client";

import { getAI, getGenerativeModel, GoogleAIBackend, Schema, ThinkingLevel } from "firebase/ai";
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
  imageAlt?: string;
  sourceLocale: string;
  imageFile?: File | null;
}): Promise<{
  title: LocaleTrio;
  excerpt: LocaleTrio;
  imageAlt: LocaleTrio;
  detectedTitleLanguage: string;
  detectedExcerptLanguage: string;
  detectedImageAltLanguage: string;
}> {
  const ai = getAI(getFirebaseApp(), { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(
    ai,
    {
      model: "gemini-3.8-flash",
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: Schema.object({
          properties: {
            title: localeObjectSchema(),
            excerpt: localeObjectSchema(),
            imageAlt: localeObjectSchema(),
            detectedTitleLanguage: Schema.string(),
            detectedExcerptLanguage: Schema.string(),
            detectedImageAltLanguage: Schema.string(),
          },
        }),
      },
    },
    { timeout: 45_000 },
  );

  const prompt = `Translate this event into Swedish (sv), English (en), Spanish (es), German (de), and French (fr).
Keep the same facts, length, and line breaks. Do not add sentences or rewrite it as new marketing copy.

detectedTitleLanguage, detectedExcerptLanguage, and detectedImageAltLanguage:
- sv, en, es, de, or fr when that field is written in that language
- other when it is any different language
- an empty string when the field is empty

If a field is sv, en, es, de, or fr, keep its original wording in that language and translate the others.
If it is other, translate it into all five languages.
Keep names, prices, dates, phone numbers, and URLs unchanged.
Preserve **bold**, _italic_, and lines that start with "• ".
imageAlt is one short sentence per language. If no photo description was given, write it from the title.

Typed into language box: ${input.sourceLocale} (this label may be wrong).

Source title:
${input.title.trim()}

Source description:
${input.excerpt.trim()}

Source photo description:
${input.imageAlt?.trim() ?? ""}`;

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
    detectedTitleLanguage?: unknown;
    detectedExcerptLanguage?: unknown;
    detectedImageAltLanguage?: unknown;
  };

  const detected = (value: unknown) => (typeof value === "string" ? value.trim() : "");

  return {
    title: localeTrioFromPartial(parsed.title),
    excerpt: localeTrioFromPartial(parsed.excerpt),
    imageAlt: localeTrioFromPartial(parsed.imageAlt),
    detectedTitleLanguage: detected(parsed.detectedTitleLanguage),
    detectedExcerptLanguage: detected(parsed.detectedExcerptLanguage),
    detectedImageAltLanguage: detected(parsed.detectedImageAltLanguage),
  };
}
