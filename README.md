# El Portero

Restaurant website for **El Portero**, Torrevieja — see [`docs/PRD.md`](docs/PRD.md) for product requirements.

## Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Lucide (icons)

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start    # production server on port 3000
npm run lint
```

If you see errors about a missing chunk (e.g. `Cannot find module './611.js'`) or a broken `.next` folder, clear the build output and rebuild:

```bash
npm run clean && npm run build
```

## Project layout

| Path | Purpose |
|------|--------|
| `src/app/` | Routes (`layout.tsx`, `page.tsx`, `globals.css`) |
| `src/views/` | Page UI (client components; not `src/pages` — reserved by Next.js) |
| `src/components/layout/` | Header, footer, `PageShell` |
| `src/i18n/` | Locale provider, strings (EN default, ES & SV) |
| `src/css/design-system.css` | Color, type, radius tokens (`@theme`) |

## Design tokens

Variables live in `src/css/design-system.css` and pair with `next/font` in `src/app/layout.tsx` (`--font-cormorant`, `--font-jakarta`).
