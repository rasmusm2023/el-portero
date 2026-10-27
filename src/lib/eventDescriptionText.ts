import { locales, type Locale } from "@/i18n/strings";
import { emptyLocaleTrio } from "@/i18n/localeMeta";
import type { LocaleTrio } from "@/lib/publicEventTypes";

export type EventDescriptionLines = Record<Locale, string[]>;

export function normalizeEventDescriptionText(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&(?:#10|#x0a|NewLine);/gi, "\n")
    .replace(/[\u2028\u2029]/g, "\n")
    .replace(/\r\n?/g, "\n")
    .replace(/\\n/g, "\n");
}

export function eventDescriptionLinesFromText(text: string): string[] {
  return normalizeEventDescriptionText(text).split("\n");
}

export const EVENT_DESCRIPTION_BULLET = "• ";

const BULLET_PREFIX = /^(?:[•\u2022]\s+|[-*]\s+)/;

export type DescriptionInline =
  | { type: "text"; text: string }
  | { type: "bold"; children: DescriptionInline[] }
  | { type: "italic"; children: DescriptionInline[] };

/** `**bold**` and `_italic_` marks used in stored event descriptions. */
export function parseDescriptionInlines(source: string): DescriptionInline[] {
  const out: DescriptionInline[] = [];
  let index = 0;
  let buffer = "";

  const flush = () => {
    if (!buffer) return;
    out.push({ type: "text", text: buffer });
    buffer = "";
  };

  while (index < source.length) {
    if (source.startsWith("**", index)) {
      const close = source.indexOf("**", index + 2);
      if (close !== -1) {
        flush();
        out.push({
          type: "bold",
          children: parseDescriptionInlines(source.slice(index + 2, close)),
        });
        index = close + 2;
        continue;
      }
    }
    if (
      (source[index] === "*" && !source.startsWith("**", index)) ||
      (source[index] === "_" && !source.startsWith("__", index))
    ) {
      const marker = source[index] ?? "*";
      const close = source.indexOf(marker, index + 1);
      if (close !== -1) {
        flush();
        out.push({
          type: "italic",
          children: parseDescriptionInlines(source.slice(index + 1, close)),
        });
        index = close + 1;
        continue;
      }
    }
    buffer += source[index];
    index += 1;
  }

  flush();
  return out;
}

function escapeEditorText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlinesToEditorHtml(nodes: DescriptionInline[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text") return escapeEditorText(node.text);
      const tag = node.type === "bold" ? "strong" : "em";
      return `<${tag}>${inlinesToEditorHtml(node.children)}</${tag}>`;
    })
    .join("");
}

const EDITOR_BULLET_PREFIX = /^(?:[•\u2022])\s?/;

/** Safe HTML for the admin description field. Text is escaped; only strong/em/ul/li/br are tags. */
export function descriptionToEditorHtml(text: string): string {
  const normalized = normalizeEventDescriptionText(text);
  if (!normalized) return "";

  let html = "";
  let listOpen = false;
  let needsBreak = false;

  const closeList = () => {
    if (!listOpen) return;
    html += "</ul>";
    listOpen = false;
    needsBreak = false;
  };

  for (const line of normalized.split("\n")) {
    const bullet = EDITOR_BULLET_PREFIX.exec(line);
    if (bullet) {
      needsBreak = false;
      if (!listOpen) {
        html += "<ul>";
        listOpen = true;
      }
      const body = inlinesToEditorHtml(parseDescriptionInlines(line.slice(bullet[0].length)));
      html += `<li>${body || "<br>"}</li>`;
      continue;
    }

    closeList();
    if (needsBreak) html += "<br>";
    html += inlinesToEditorHtml(parseDescriptionInlines(line));
    needsBreak = true;
  }

  closeList();
  return html;
}

export type EventDescriptionFormat = "text" | "bullets";

/** Apply plain text or a bullet prefix to every line touched by the selection. */
export function formatEventDescriptionSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  mode: EventDescriptionFormat,
): { value: string; selectionStart: number; selectionEnd: number } {
  const start = Math.max(0, Math.min(selectionStart, selectionEnd, value.length));
  const end = Math.max(0, Math.min(Math.max(selectionStart, selectionEnd), value.length));
  const from = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const breakAt = value.indexOf("\n", end);
  const to = breakAt === -1 ? value.length : breakAt;
  const lines = value.slice(from, to).split("\n");
  const formatted = lines.map((line) => {
    const stripped = line.replace(BULLET_PREFIX, "");
    if (mode === "text") return stripped;
    if (!stripped.trim()) return lines.length === 1 ? EVENT_DESCRIPTION_BULLET : line;
    return `${EVENT_DESCRIPTION_BULLET}${stripped.replace(/^\s+/, "")}`;
  });
  const nextChunk = formatted.join("\n");
  return {
    value: value.slice(0, from) + nextChunk + value.slice(to),
    selectionStart: from,
    selectionEnd: from + nextChunk.length,
  };
}

export function eventDescriptionTextFromLines(lines: unknown): string | null {
  if (!Array.isArray(lines)) return null;
  return lines.map((line) => String(line ?? "")).join("\n");
}

export function eventDescriptionLinesFromLocaleTrio(excerpt: LocaleTrio): EventDescriptionLines {
  const out = {} as EventDescriptionLines;
  for (const locale of locales) {
    out[locale] = eventDescriptionLinesFromText(excerpt[locale] ?? "");
  }
  return out;
}

export function normalizeEventDescriptionLocaleTrio(excerpt: LocaleTrio): LocaleTrio {
  const out = emptyLocaleTrio("");
  for (const locale of locales) {
    out[locale] = normalizeEventDescriptionText(excerpt[locale] ?? "");
  }
  return out;
}

export function resolveEventDescriptionText(
  excerpt: LocaleTrio,
  linesByLocale: unknown,
): LocaleTrio {
  const linesRecord =
    linesByLocale && typeof linesByLocale === "object"
      ? (linesByLocale as Partial<Record<Locale, unknown>>)
      : {};

  return locales.reduce<LocaleTrio>((out, locale) => {
    const fromLines = eventDescriptionTextFromLines(linesRecord[locale]);
    out[locale] = fromLines ?? normalizeEventDescriptionText(excerpt[locale] ?? "");
    return out;
  }, emptyLocaleTrio(""));
}
