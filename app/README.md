# Sasa · web

The Next.js application for Sasa. Lives inside the monorepo at `/web`.

For project-wide docs see the workspace root: `../README.md`, `../STATUS.md`, `../docs/`.

---

## Quick start

```bash
# Install dependencies (once)
pnpm install

# Dev server (Turbopack)
pnpm dev

# Production build (validates everything)
pnpm build

# Production server
pnpm start
```

App runs at **http://localhost:3000**. Lands on `/feed`.

---

## Stack

- **Next.js 16** (App Router, RSC, Turbopack)
- **React 19**
- **TypeScript 5** strict
- **Tailwind CSS v4** with CSS-variable design tokens
- **Framer Motion 12** for spring-physics motion
- **Lucide** icons (1.25px stroke)
- **gray-matter** for MDX frontmatter (content loaded at build time)

No DB, no auth, no AI yet — those land in Phases D and F. See `../STATUS.md`.

---

## Directory map

```
web/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx              ← fonts + theme color
│  │  ├─ globals.css             ← design tokens (single source)
│  │  ├─ page.tsx                ← redirect → /feed
│  │  ├─ not-found.tsx
│  │  └─ (app)/                  ← authenticated shell (no auth yet)
│  │     ├─ layout.tsx           ← bottom TabBar
│  │     ├─ feed/page.tsx        ← the Feed
│  │     ├─ feed/[slug]/page.tsx ← the Brief
│  │     ├─ feed/[slug]/sandbox/ ← Sandbox preview
│  │     ├─ sandbox/page.tsx
│  │     ├─ ledger/page.tsx
│  │     └─ me/page.tsx
│  ├─ components/
│  │  ├─ shell/                  ← TopBar, TabBar
│  │  ├─ brief/                  ← Markdown, Diff
│  │  └─ ui/                     ← Pill, NewDot
│  └─ lib/
│     ├─ cn.ts                   ← className helper
│     ├─ motion.ts               ← spring presets
│     ├─ greeting.ts             ← time-aware multilingual greeting
│     └─ content/                ← types + MDX loader
├─ next.config.ts
├─ package.json
└─ tsconfig.json
```

Content (Briefs) lives at `../content/updates/*.mdx`. The loader reads
`../content/updates` relative to `process.cwd()` so it works in dev and build.

---

## Design tokens

All colors, fonts, and motion presets live in two files:

- `src/app/globals.css` — CSS variables + `@theme inline` Tailwind bridge
- `src/lib/motion.ts` — Framer Motion springs

**Never inline hex values in components.** Use Tailwind classes like
`bg-paper`, `text-ink`, `border-line`, or CSS vars `var(--ink-2)`.

Section accents (`--accent-feed`, `--accent-brief`, etc.) are NOT
broadly applied yet — they will color section-specific top bars in Phase B+.

---

## Glass vs. flat

- **Glass** (`className="glass"`) — for things that *float* over content:
  TopBar, TabBar, audio player, modal sheets. That's it.
- **Flat paper** — everything that *stays*: Brief body, cards, lists.

If in doubt: flat.

---

## What's missing (intentional, will be added in later phases)

| Missing | When |
|---|---|
| Auth (Clerk) | Phase F |
| Database (Neon + Drizzle) | Phase F |
| Sandbox grading (Claude API) | Phase D |
| Audio narration (ElevenLabs TTS) | Phase F |
| PDF Passport export | Phase E |
| PWA / offline support | Phase F |
| Admin ingest console | Phase G |
| Animations (the "card-falls-into-Ledger" moment) | Phase F |
