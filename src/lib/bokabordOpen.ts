import { BOKABORD_WIDGET_HASH } from "@/config/bokabord";
import type { Locale } from "@/i18n/strings";

/** Mirrors `widget.min.js` — Swedish locale is sent as `sw` to Boka bord. */
function bokabordLangParam(locale: Locale): string {
  if (locale === "sv") return "sw";
  return locale;
}

/** Same UA test as Waiteraid’s widget (mobile → full navigation). */
function isMobileUserAgent(): boolean {
  if (typeof navigator === "undefined") return false;
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
    navigator.userAgent || "",
  );
}

function appendUtmTags(url: string): string {
  if (typeof window === "undefined") return url;
  const paramsToTrack = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
  ] as const;
  const urlParams = new URLSearchParams(window.location.search);
  let extra = "";
  for (const param of paramsToTrack) {
    const value = urlParams.get(param) ?? sessionStorage.getItem(param);
    if (value) {
      sessionStorage.setItem(param, value);
      extra += `&${param}=${encodeURIComponent(value)}`;
    }
  }
  return url + extra;
}

let messageListenerAttached = false;

function ensureMessageListener(): void {
  if (typeof window === "undefined" || messageListenerAttached) return;
  messageListenerAttached = true;

  const body = document.body;
  window.addEventListener("message", function (event: MessageEvent) {
    const mobile = isMobileUserAgent();
    const modalInner = document.querySelector(
      ".bb_modaloverlay .bb_modal",
    ) as HTMLElement | null;

    if (event.data === "closeWaiteraidFrame") {
      document.documentElement.classList.remove("with-popup");
      document.querySelectorAll(".bb_modaloverlay").forEach((md) => md.remove());
      body.style.position = "";
    } else if (event.data === "scrollTop") {
      document.querySelector(".bb_modaloverlay")?.scrollTo(0, 0);
    } else {
      const contentHeight = parseInt(String(event.data), 10);
      if (!Number.isNaN(contentHeight) && modalInner) {
        if (parseInt(String(window.innerWidth), 10) <= 748 || mobile) {
          modalInner.style.height = "";
        } else {
          modalInner.style.height = `${contentHeight}px`;
        }
      }
    }
  });
}

function ensureModalCss(): void {
  const cssId = "bokabord-modalcss";
  if (document.getElementById(cssId)) return;
  const link = document.createElement("link");
  link.id = cssId;
  link.rel = "stylesheet";
  link.href = "https://app.bokabord.se/widget-popup/modal.css";
  link.media = "all";
  document.head.appendChild(link);
}

function openDesktopOverlay(iframeUrl: string): void {
  const body = document.body;
  const html = document.documentElement;

  document.querySelectorAll(".bb_modaloverlay").forEach((md) => md.remove());
  html.classList.remove("with-popup");

  const overlay = document.createElement("div");
  const modal = document.createElement("div");
  overlay.classList.add("bb_modaloverlay");
  overlay.addEventListener("click", (e) => e.stopPropagation());
  modal.addEventListener("click", (e) => e.stopPropagation());
  modal.style.minHeight = "calc(100vh - 30px)";
  modal.classList.add("bb_modal");
  overlay.appendChild(modal);

  const iframe = document.createElement("iframe");
  iframe.setAttribute("src", iframeUrl);
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("scrolling", "auto");
  iframe.setAttribute("width", "100%");
  iframe.setAttribute("height", "100%");
  modal.appendChild(iframe);
  body.appendChild(overlay);
  html.classList.add("with-popup");

  ensureModalCss();
  ensureMessageListener();
}

/**
 * Opens Boka bord the same way as Waiteraid’s `widget.min.js` (iframe layer on desktop,
 * navigate on mobile). Does not rely on their script’s `DOMContentLoaded` handler (broken under Next.js).
 */
export function openBokabordReservation(locale: Locale): void {
  const lang = bokabordLangParam(locale);
  let iframeUrl =
    `https://app.bokabord.se/reservation/?app_type=bokabord&hash=${encodeURIComponent(BOKABORD_WIDGET_HASH)}` +
    `&lang=${encodeURIComponent(lang)}`;
  iframeUrl = appendUtmTags(iframeUrl);

  if (isMobileUserAgent()) {
    window.location.href = iframeUrl;
    return;
  }
  openDesktopOverlay(iframeUrl);
}
