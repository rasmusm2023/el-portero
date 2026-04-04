# Product Requirements Document — El Portero

**Document status:** Draft v2  
**Last updated:** 2026-04-04  
**Product:** Public website + admin CMS for El Portero restaurant  
**Location:** C. Ulpiano, 28, 03182 Torrevieja, Alicante, Spain  
**Brand context:** Owner Magnus Hedman (former professional goalkeeper, Sweden). The site may subtly reference sport/precision/presence without becoming a sports site.

---

## 1. Vision & goals

### 1.1 Vision

A **luxurious, calm, editorial** web presence that matches the restaurant’s in-venue palette (gold, black, white), communicates quality and warmth, and makes it easy to discover the menu, book a table, see events, and contact the team.

### 1.2 Primary goals

- Drive **table reservations** and **event awareness**.
- Present **menu and hours** clearly, including real-time open/closed state and **exception messaging** when relevant.
- Grow **organic visibility** through strong **SEO** while preserving **luxury UX** (see §8.4).
- Allow **staff-controlled updates** (menu, media, events, hours, contact) without code deploys.
- Support **EN (default), ES, SV** with consistent UX.

### 1.3 Success metrics (to refine)

- Reservation conversion (visits → completed booking).
- Bounce rate on menu and contact pages.
- Admin task time: publish menu change, publish event, swap hero media.

---

## 2. Non-goals & boundaries

- **Not** a full POS, kitchen, or inventory system.
- **No payments through the website** — including reservations, deposits, cancellation fees, and merchandise. Payment or late-fee collection happens **outside** the site (e.g. in person or via separate arrangements); the site may **communicate** policy only.
- **Not** in-scope unless specified later: gift cards, loyalty program, multi-location.
- **Not** replacing email/phone for all guest communication unless notification flows are explicitly added.

---

## 3. Personas

| Persona | Needs |
|--------|--------|
| **Guest** | Hours, menu, imagery, events, reservation, contact, correct language. |
| **Admin** | Secure login, edit structured content, upload/replace media, schedule events, **reuse archived events**, manage hours exceptions/banners, see safe previews where applicable. |

---

## 4. Information architecture

### 4.1 Public routes (indicative)

- **Landing** — Hero (image/video), positioning, CTAs (menu, book, contact).
- **Menu** — Sections, dishes, descriptions, prices, dietary notes if offered.
- **Events** — List + detail; **past events hidden** from the public site (see §5.5).
- **Reservation** — Form and confirmation UX; slot rules in §5.6.
- **Contact** — Form, map/embed, address, optional phone/email display.
- **Opening hours** — Dedicated block or page; **live open/closed** using stored hours + timezone.
- **Gallery / imagery** — Curated photos (and optional short video embeds).

### 4.2 Admin

- **Sign-in** — Email/password or provider per chosen backend (Supabase Auth vs Firebase Auth).
- **Dashboard** — Shortcuts to edit menu, hours, contact, media, hero, events.
- **Role model** — Start with single role `admin`; structure data model to allow `editor` later if needed.

---

## 5. Functional requirements

### 5.1 Landing page

- Hero: configurable **image or video** (see admin-editable content).
- Brand-consistent typography and spacing; clear primary CTAs.
- Optional: short story line (copy) — editable or static per phase.

### 5.2 Contact form

- Fields (minimum): name, email, message; optional phone.
- **Anti-spam:** server-side validation plus at least one of honeypot, rate limiting, and/or CAPTCHA (e.g. Turnstile/hCaptcha) — exact stack TBD; requirement is **meaningful abuse protection** without blocking legitimate guests.
- Success and error states; no silent failures.
- **Email:** on submission, send notification to a **configurable restaurant address** (see §8.3).

### 5.3 Opening hours

- Admin defines weekly schedule + **exceptions** (holidays, one-off closures, special openings).
- **Timezone:** **Europe/Madrid** — the official timezone used in Torrevieja and the rest of mainland Spain (CET / CEST).
- **Open/closed indicator** derived from stored hours + exceptions + current time in that timezone.
- Display both “today” status and full week.
- **Prominent site messaging:** when an exception applies (e.g. holiday closure), admins can surface a **header/banner** message so visitors see it without hunting for small print.

### 5.4 Menu

- Structured: categories, items, description, price, optional tags (e.g. vegetarian).
- Order of categories/items editable by admin.
- Public menu is **read-only**; updates are immediate after save (with optional “draft” later).

### 5.5 Events

- Create, edit, **schedule** start/end (display window), title, description, optional image.
- **Public site:** only **upcoming / currently active** events (per business rules) appear to guests. **Past events are hidden** from listings and public URLs (or return 404/not listed — implementation detail).
- **Admin archive:** ended events remain in the **admin archive** (not deleted by default). Admins can **edit dates and copy** to **reuse** an event (e.g. annual recurrence by updating fields) without recreating from scratch.

### 5.6 Table reservation

- **Captured data:** number of guests, **selected time slot**, date, name, contact (email and/or phone as required), optional notes.
- **Time slots:**
  - Slots start every **15 minutes** during bookable service hours.
  - Each reservation is for a **fixed duration of 2 hours** (table held for that window; communicate clearly in UI and confirmations).
- **Cancellation policy (communicated on site and in emails):** guests must cancel **at least 24 hours** before the reservation time. Cancellations inside that window may incur a **late cancellation fee**, charged **outside** the website (see §2). Copy must be clear and locale-aware (EN/ES/SV).
- **Operational rules** (max party size, same-day booking cutoff, double-booking handling): finalize during implementation; document defaults in admin or settings.
- **Confirmation UX:** on-screen confirmation plus **email** to the guest (recommended) and **notification email to the restaurant** (see §8.3).

### 5.7 Imagery & media limits

- Gallery: ordered images; **fast loading** via responsive images (`srcset`/sizes), appropriate formats (e.g. WebP/AVIF where supported with fallbacks), and lazy loading below the fold.
- **Quality vs weight:** follow **best-practice** web thresholds — sharp enough for luxury presentation on retina displays, but **normalized/compressed** server-side or at upload so files are not unnecessarily large. Avoid storing multiple redundant full-resolution masters unless required for print; cap sensible max dimensions for web use.
- Video/hero: prefer **short loops**, reasonable bitrate, or **embed** (e.g. YouTube/Vimeo) for long-form to avoid huge self-hosted files.
- Admin can add/remove/reorder; **alt text** for accessibility and SEO.
- Exact numeric caps (e.g. max MB per upload, max pixel dimensions) — set in implementation with the above principles; document in admin help text.

### 5.8 Language selector

- **Default: English.** **Spanish and Swedish** selectable.
- URL strategy: prefix (`/en`, `/es`, `/sv`) or query — **to be decided in implementation**; content keys stored per locale in DB or translation files for static UI strings.

### 5.9 Admin content editing

Admins must be able to update **without** redeploying the site:

| Content | Capability |
|--------|------------|
| Menu | CRUD dishes, descriptions, prices, ordering, sections |
| Opening hours | Weekly hours + exceptions; **optional header/banner** for closures/special messages tied to exceptions |
| Contact | Phone, email (including **notification target** for forms if distinct from public email), social links if shown, address text |
| Images / videos | Gallery, hero asset, optional inline media |
| Hero | Image or video + optional headline/subcopy if modeled |
| Events | CRUD + scheduling; **archived past events** editable for reuse |

**Important:** Git `main` vs `dev` (§7) governs **code** releases. **CMS content** is stored in the backend and is independent of branch; admins edit the **live** content after deployment.

---

## 6. Design system (luxury, gold / black / white)

### 6.1 Principles

- Restrained **gold** as accent; **black** and **white** (or near-black / off-white) as foundation.
- Generous whitespace, strong hierarchy, editorial type.
- Motion: subtle only (hover, page transitions).

### 6.2 Color tokens (initial — exact hex in design tokens file)

| Token | Role |
|-------|------|
| `background` | Primary page background (white or warm off-white) |
| `surface` | Cards, elevated panels |
| `foreground` | Primary text (near-black) |
| `muted` | Secondary text |
| `accent` | Gold — links, key borders, highlights |
| `accent-muted` | Gold at lower emphasis |
| `border` | Hairline dividers |

Document **contrast ratios** (WCAG AA minimum for body text).

### 6.3 Typography

- **Display / headings:** one distinctive serif or refined sans (final fonts in tokens).
- **Body:** highly readable serif or sans pairing; sizes on a **modular scale** (e.g. major third).
- Document: font families, weights, line-height, letter-spacing, responsive steps.

### 6.4 Spacing & layout

- Base unit (e.g. 4px or 8px grid).
- Section spacing, container max-width, horizontal padding at breakpoints.
- Document breakpoints (e.g. sm / md / lg / xl).

### 6.5 Radii & borders

- Named tokens: e.g. `radius-sm`, `radius-md`, `radius-lg` (luxury often uses **small to medium** radius, not bubbly).
- Optional hairline `border` token for gold accents.

### 6.6 Icons

- **Single icon family** across UI (e.g. Lucide, Phosphor, or similar) — one choice, consistent stroke and size steps.
- Document sizes: `icon-sm`, `icon-md`, `icon-lg`.

### 6.7 Documentation deliverable

- **Living reference:** Tailwind theme extension + short `DESIGN.md` or Storybook/page in dev listing tokens and examples (buttons, inputs, cards). Goal: **you can change tokens in one place** and see the effect.

---

## 7. Engineering & workflow

### 7.1 Stack

- **Frontend:** React, TypeScript, Tailwind CSS.
- **Backend (choice):** **Supabase** or **Google Firestore** (+ Firebase Auth if Firestore).
  - Criteria: auth quality, storage for images, realtime needs, cost, DX, EU data residency preferences.

### 7.2 Git branches

- **`main`** — production-ready code; deploys to **live** site.
- **`dev`** — integration branch for ongoing work; merge to `main` when releasing.
- Optional: feature branches from `dev`, PRs into `dev`, release PR `dev` → `main`.

### 7.3 Content vs code

- **Code** flows: `dev` → `main` → deploy.
- **Content** flows: Admin UI → database/storage → visible on live site without a new deploy.

---

## 8. Technical considerations (to lock in build phase)

### 8.1 Data model (high level)

- Settings: contact, hours, **Europe/Madrid** timezone locked or defaulted, hero config, locale defaults, **exception/banner** copy for hours overrides.
- Menu: categories, items, prices, sort order.
- Events: title, body, media, start/end; **visibility** (public vs past/hidden); **archived** retained for admin reuse.
- Media: metadata + storage URLs; processing pipeline aligned with §5.7.
- Reservations & contact submissions: stored records + optional status; link to slot duration and cancellation timestamp for policy enforcement messaging.

### 8.2 Auth & security

- Admin routes protected; public API keys scoped; server-side rules (Supabase RLS or Firestore rules).
- HTTPS only; secrets in env vars, not in repo.

### 8.3 Reservation & notifications

- **Restaurant notifications:** send email to a **specific, admin-configurable address** (or addresses) for **new reservations** and **new contact form submissions**.
- **Guest email:** confirmation for reservations (and optionally contact auto-reply) — recommended; templates should include policy reminders (2-hour seating, 24h cancellation).
- Provider TBD (Resend, SendGrid, SMTP, Firebase extensions, etc.).

### 8.4 Performance & SEO

- **SEO is a priority:** technical SEO (clean URLs, canonicals, hreflang for EN/ES/SV, structured data where appropriate e.g. `Restaurant` / `LocalBusiness`, valid semantics) and **content SEO** (unique titles/descriptions per page/locale, meaningful headings, fast LCP).
- **Design first:** optimizations must **not** flatten the luxury feel — no keyword stuffing, no intrusive interstitials; balance via performance (images, fonts), accessible markup, and editorial copy.
- Meta titles/descriptions per locale; **OG/Twitter** cards for sharing.
- Lazy-loaded images; LCP target for hero; font loading strategy to avoid CLS.
- `sitemap.xml`, `robots.txt`; monitor Core Web Vitals.

### 8.5 Accessibility

- **Target: WCAG 2.1 Level AA** across primary flows (landing, menu, events, reservation, contact, language switching).
- Keyboard navigation, visible focus, sufficient contrast (incl. gold accent use), form labels/errors, alt text; respect `prefers-reduced-motion` for non-essential animation.

### 8.6 Legal & privacy (GDPR) & cookies

- **Cookie compliance:** a **cookie consent** flow (banner or equivalent) that meets EU expectations: **before** non-essential scripts run (e.g. analytics, marketing pixels), with granular choice where required, link to privacy/cookie policy.
- Privacy policy covering form and reservation data, retention, rights; contact details for the controller.
- Analytics (if used) only after consent where legally required — product may prefer **privacy-friendly** analytics to reduce friction.

### 8.7 Analytics (optional for v1)

- If included: Plausible, Fathom, GA4, etc. — chosen stack must align with **§8.6** (consent + documentation).

---

## 9. Phasing suggestion

| Phase | Scope |
|-------|--------|
| **P0** | Design tokens, landing, i18n shell, hours + open/closed, contact, backend + auth, admin for hours & contact |
| **P1** | Menu + admin, gallery, hero, events |
| **P2** | Reservations (slots + policy copy) + email notifications; cookie consent; SEO/a11y polish |
| **P3** | Draft previews, richer roles, analytics |

---

## 10. Open decisions checklist

Remaining items to decide in implementation:

- [ ] Supabase vs Firestore (and hosting for React app: Vercel, Netlify, Firebase Hosting, etc.)
- [ ] i18n: URL strategy and where translated strings live vs DB-backed copy
- [ ] Reservation: max party size, same-day cutoff, capacity per slot, guest SMS vs email-only
- [ ] Anti-spam: specific provider (Turnstile, hCaptcha, reCAPTCHA) + server rate limits
- [ ] Map: Google Maps vs OpenStreetMap embed
- [ ] Exact gold/black/white hex values and font files/licenses
- [ ] Numeric media caps (MB / max dimensions) within §5.7 principles

---

## 11. Glossary

- **PRD:** Product Requirements Document — what we build and why.
- **CMS:** Content managed by admins in the app, stored in backend.

---

*This document is the single source of truth for product scope until updated. Technical ADRs (Architecture Decision Records) may supplement backend and auth choices.*
