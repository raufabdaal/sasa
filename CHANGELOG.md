# Changelog

All notable changes to **Sasa** are recorded here.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/).
We use semantic-ish versioning: `0.x.y` until we ship to real teachers, then `1.0.0`.

**Convention:** every session ends with a new entry below. No exceptions.

Categories:
- **Added** — new files, features, screens, endpoints
- **Changed** — modified behavior, refactors, design tweaks
- **Removed** — deleted files or features
- **Fixed** — bugs squashed
- **Docs** — documentation only
- **Ops** — infrastructure, env, deployment, manual setup
- **Decision** — an architectural decision was logged in `ops/DECISIONS.md`

---

## [Unreleased]
*Work currently in progress lives here.*

### Next up
- Founder sets up free Groq + Gemini keys (MT-010 + MT-011) so we can wire real Phase D AI grading
- Then: build remaining Sandbox exercise UIs (rewrite, plan_opener, design_aoi, identify_construct)
- Or further free polish: scroll-spy section labels, reading-progress bar

---

## [0.2.2] — 2026-06-20 — *Free tier, em dash purge, onboarding gate, completion celebration*

> **Why:** Founder confirmed v2.1 design is "perfect" and provided a clean diagnosis: no budget right now, em dashes look AI-generated, onboarding should auto-trigger for first visit, completion polish is wanted. All addressed.

### Added — spec
- DEV-011: em dashes removed from user-facing copy
- DEV-012: free-tier AI grading (Groq primary + Gemini fallback) replaces paid Anthropic for v0
- DEV-013: no auth in v0, localStorage profile persistence
- DEV-014: TTS deferred, speaker icon shows polite "coming soon" toast
- DEV-015: onboarding gating note (localStorage v0, real auth in Phase F)

### Added — code
- `app/src/components/brief/ComingSoonAction.tsx`: button + toast for Listen and Save icons
- `app/src/page.tsx` rewritten as client component with localStorage-based onboarding gate
- Completion celebration in `SandboxClient.tsx`: gold pulse, check mark, "Added to your Ledger", clear next-step CTAs (See your Ledger / Back to Feed)
- `OnboardingClient.tsx`: stores profile + onboarded flag in localStorage on finish, then routes to /feed

### Changed
- All 5 MDX seed Briefs: every em/en dash replaced with periods or commas
- All user-facing TSX strings + JSX text: dashes purged
- `preview.html`: dashes purged from all visible text; speaker/save icons in Brief now trigger a "Listening coming soon" / "Saving coming soon" toast
- Desktop right rail in Brief: "Listen instead" and "Save for later" rows are now passive labels with "Soon" hint instead of clickable buttons
- `.env.example`: `ANTHROPIC_API_KEY` replaced with `GROQ_API_KEY` + `GEMINI_API_KEY` + `AI_PROVIDER`
- `docs/ops/SECRETS_AND_KEYS.md`: section 1 rewritten for Groq (free), added section 1b for Gemini, section 1c notes Anthropic deferred
- `docs/ops/MANUAL_TASKS.md`: MT-010 changed from Anthropic ($20) to Groq ($0). New MT-011 for Gemini. MT-020 (Clerk) marked deferred. SMS path dropped (cost).
- `CHECKLIST.md`: updated counts (69 done, 42 left, 62%)

### Verified
- `pnpm build` passes, all 19 routes prerender
- Zero em dashes in user-visible code or content
- localStorage gating works: first visit to `/` redirects to `/onboarding`, subsequent visits to `/feed`

---

## [0.2.1] — 2026-06-20 — *Brighter pops, desktop layout, readability, onboarding*

---

## [0.2.1] — 2026-06-20 — *Brighter pops, desktop layout, readability, onboarding*

> **Why:** Founder approved v2 direction but flagged four follow-ups: (1) more color pop on key moments, (2) the desktop view felt like a stretched phone view, (3) general readability could go up, (4) settings had aspirational dead-end rows. Also: green-light to build onboarding.
> **Outcome:** All four addressed. Plus a 4-step onboarding flow.

### Added — spec (founder's "keep track" rule)
- DEV-006 logged — brighter coral/gold pops
- DEV-007 logged — desktop responsive layout
- DEV-008 logged — readability bumps
- DEV-009 logged — settings honesty (drop dead-end rows)
- DEV-010 logged — refined liquid glass

### Changed — design tokens (DEV-006, DEV-008)
- **New `--coral` `#FF7F5C`** for primary CTAs (replaces peach as PRIMARY action color)
- Coral inherits the "do this now" energy; peach now reserved for highlights and secondary
- **New `--gold-bright` `#F2B441`** + `--gold-soft` for celebratory completion states
- Deepened `--sage` `#7A8B6F` → `#5F7A5C` (stronger "done" semantics)
- Deepened `--ink-2` `#5C544A` → `#4A4239` (stronger secondary text contrast)
- Streak indicator (the Saturn rings) now uses coral with a soft glow
- Brief body: 17.5px → **18.5px**, line-height 1.65 → **1.7**
- Pull-quote: now has a **coral left border** to make the "look at this" moment unmistakable
- Settings row labels: 15px → 15.5px font-weight medium

### Added — desktop layout (DEV-007)
- `.app-shell` grid layout: mobile = single column with bottom TabBar, desktop ≥1024px = 240px SideNav + main content
- `app/src/components/shell/SideNav.tsx` — glass-side sticky navigation with brand, primary nav, and "What I teach" footer
- `app/src/components/shell/TabBar.tsx` — gets `.tabbar-mobile-only` class (hides on desktop)
- **Feed:** 2-column grid on desktop, recommended card spans full width with larger 36px title
- **Brief:** 2-column with sticky right rail (260px) showing metadata + action shortcuts
- **Sandbox detail:** wider max-width (760px) with desktop back link
- **Ledger / Sandbox tab / Me:** desktop-appropriate spacing, larger headings, max-width respect

### Added — glass refinements (DEV-010)
- Blur 20px → **28px** for cleaner content separation
- Opacity 78% → **82%** for stronger legibility
- Brighter inner-top highlight (edge-lit Apple effect)
- New `.glass-side` variant for the desktop sidebar

### Removed (DEV-009)
- "About Sasa" settings row — no About page exists yet
- "Notifications" promoted from main settings → "Coming soon" group with Phase F label
- "Download for offline" same treatment
- "Export Retooling Passport" labeled "Phase E" honestly

### Added — onboarding (founder green-lit)
- `app/src/app/(auth)/onboarding/page.tsx` — new route at `/onboarding`
- `app/src/components/onboarding/OnboardingClient.tsx` — full 4-step flow:
  1. **What do you teach?** Level → subjects (max 6) → grades, with progressive disclosure
  2. **Where do you teach?** Free-text input with 10-school typeahead pre-seed
  3. **How should we greet you?** First name + greeting language picker, with **live preview** of the greeting
  4. **You're 6 updates behind.** Two-CTA finale → primary "Show me what's new" + secondary "I'll just browse"
- Top progress bar (4 dots): done = sage, current = coral, future = cream-3
- Honest copy: *"You can change subjects, grades, school, and greeting anytime in Profile."*

### Changed — preview.html
- All v2.1 design tokens applied
- **NEW: View switcher** (📱 Phone / 💻 Desktop) at top of preview
- **NEW: Desktop scenes** for every screen, shown inside a browser-chrome mockup (240px sidebar + main)
- Interactive Sandbox works in both phone and desktop views
- Streak Saturn ring gets coral glow

### Verified
- `pnpm build` passes — 19 routes (added `/onboarding`)
- Phone view unchanged in behavior (same components, new tokens)
- Desktop view uses `lg:` Tailwind prefix throughout — zero impact on mobile

---

## [0.2.0] — 2026-06-20 — *Design v2: warm, functional, color-coded*

> **Why:** Founder reported v1 felt "stale / soulless / too far on elegant luxury." Functionality was suffering for restraint — dead-end empty states, hairline buttons that didn't read as tappable, no fast subject identification. Inspiration images pointed clearly at warmer cream + peach/apricot palette, friendlier serif, real solid buttons, highlighted-quote treatments.
> **Outcome:** Complete design language replacement. Both `preview.html` AND the real Next.js app updated. Sandbox is now actually interactive.

### Added — spec
- `docs/spec/design-philosophy-v2.md` — the new "really well-made notebook" philosophy
- `docs/spec/DESIGN_DEVIATIONS.md` — append-only log of every change-from-spec, with template
- DEV-001 through DEV-005 logged

### Changed — design tokens
- `app/src/app/globals.css` — completely rewritten
  - Background: `#FAF8F4` → `#F7F2E8` (warmer)
  - New peach `#E8A87C` as primary CTA color
  - New sage `#7A8B6F` for "done/completed" state
  - New highlight yellow `#F4D35E`
  - Subject color palette: Chemistry=sage, Biology=sage-teal, Kiswahili=peach, ICT=soft-blue, History=clay, Math=lavender, English=gold
  - `.btn`, `.btn-primary/secondary/ghost` utility classes
  - `.card` with real shadows
  - `.highlight-quote` for in-Brief pull-outs
  - `.subj-chip` + `.subj-dot` + `[data-subj]` system
- `app/src/app/layout.tsx` — Newsreader replaced with Fraunces (friendlier, with axes for SOFT/WONK personality)

### Added — code
- `app/src/lib/subjects.ts` — subject name → color-code mapper
- `app/src/components/ui/SubjectChip.tsx`
- `app/src/components/sandbox/SandboxClient.tsx` — full interactive flow (client component)

### Changed — screens (no more dead ends; DEV-003)
- **Feed:** real cards on warm paper, recommended-on-top with "Start here" tag, color-coded by subject, "Read it →" CTA visible per card
- **Brief:** bigger 30-36px serif title, highlighted-quote treatment for key sentences, soft sage/cream diff (no more git-style red/green), solid peach "Try it in the Sandbox" button
- **Sandbox (per-update):** fully interactive — A–E grade buttons toggle, Submit enables only when all 4 graded, post-submit shows citation-first feedback (pre-written stand-in for Phase D Claude)
- **Sandbox tab:** was "Open a Brief…" dead end → now shows recommended exercise + "Or pick another" list
- **Ledger tab:** was "complete a Brief…" dead end → now shows muted preview rows + "Begin with the most recent" CTA
- **Me tab:** was placeholder → full profile with avatar, "What I teach" chips, 7-item settings list
- **TabBar:** active tab gets soft peach pill underneath the icon (clearer affordance)
- **not-found:** solid peach button

### Changed — preview.html
- Same v2 palette and components throughout
- Sandbox in preview is **interactive** — click grade buttons, Submit enables, feedback appears
- 6 scenes (Feed / Brief / Sandbox / Ledger / Passport / Profile)
- Loads Fraunces from Google Fonts CDN (works fully when double-clicked)

### Verified
- `pnpm build` passes — all 18 routes prerender static

---

## [0.1.2] — 2026-06-20 — *Zero-install preview file*

> **Why:** Founder wanted a "just double-click and it opens in the browser" preview — no terminal, no install. Reasonable. Many people get the most value from a visual quick-look, not from running a dev server.

### Added
- `preview.html` at workspace root — single 43 KB self-contained HTML file
  - Renders 6 scenes (Feed, Brief, Sandbox, AI Feedback, Ledger, Retooling Passport) inside iPhone-style phone frames
  - Switch scenes with on-screen tabs or keyboard ← → arrows
  - Zero external dependencies — system fonts, inline SVG icons, no images
  - Exact same design tokens as the real app

### Changed
- `START_HERE.md` — rewritten to present TWO clear options: (1) double-click `preview.html` or (2) run the real app via `./launch.sh`
- `README.md` — top section now shows both options as a 2-row table for instant clarity
- Both files explicitly distinguish `preview.html` (new, interactive screen-by-screen demo) from `docs/visual-mockup.html` (older spec-page mockup)

---

## [0.1.1] — 2026-06-20 — *Workspace cleanup for findability*

> **Why:** Founder reported confusion about how to run the app locally — too many top-level folders, and `index.html` looked like the entry point but was actually a static design mockup.
> **Outcome:** 3 clear top-level groups: runnable code (`app/`), content (`content/`), and documentation (`docs/`). Single `START_HERE.md` + `launch.sh` for a one-command launch.

### Added
- `START_HERE.md` — single onboarding doc with prereqs, troubleshooting, folder map
- `launch.sh` — macOS/Linux one-command launcher (checks Node, installs pnpm/deps if missing, starts dev)
- `launch.bat` — Windows equivalent

### Changed (renames / moves)
- `web/` → `app/` (clearer name for "the runnable application")
- `docs/` → `docs/spec/` (PRD, design philosophy, data architecture, user flows)
- `ops/` → `docs/ops/` (consolidated under one docs/ umbrella)
- `prompts/` → `docs/prompts/` (consolidated)
- `index.html` → `docs/visual-mockup.html` (renamed to make it obvious it's a static mockup, not the real app)
- `README.md` rewritten to point to the new layout
- `app/src/lib/content/loader.ts` — comment updated to reflect new app/ name (path unchanged)

### Verified
- ✅ `pnpm build` still passes after rename — 18 routes prerender cleanly
- ✅ Content loader still resolves `../content/updates` correctly

### Ops
- **Git history note:** The sandbox `.git` folder doesn't persist across workspace snapshots (it's in the snapshot exclusion list). The two earlier commits (`2b8dd45`, `8fd705d`) are lost from sandbox history but the *code state* is preserved. Next session will re-init git, or founder can `git init` after downloading the workspace.

---

## [0.1.0] — 2026-06-19 — *Phase A: Next.js shell + Feed + Brief*

> **Commit:** `2b8dd45` · 58 files · first runnable build
> **Try it:** `cd web && pnpm install && pnpm dev` → http://localhost:3000

### Added — project structure
- `/web/` — Next.js 16 + React 19 + Tailwind v4 + TS-strict (per **D-006**)
- `/content/updates/` — MDX briefs (workspace root, separate from app code)
- `/content/source-docs/` — empty, for future NCDC/UNEB PDFs
- `.gitignore` at workspace root
- `web/README.md` — quick-start + directory map

### Added — design system
- `web/src/app/globals.css` — full Sasa token set (paper / ink / section accents / line)
- Tailwind v4 `@theme inline` bridge (`bg-paper`, `text-ink-2`, etc.)
- Dark mode tokens (data-theme="dark")
- `.glass` utility class — liquid glass for floating surfaces only
- `.prose-brief` — serif reading surface for Brief bodies
- `.eyebrow` — mono uppercase section label
- `web/src/lib/motion.ts` — `spring`, `springSoft`, `fadeUp` presets
- Fonts via `next/font/google`: Inter, Newsreader (serif), JetBrains Mono

### Added — components
- `components/shell/TopBar.tsx` — sticky glass bar with left/center/right slots
- `components/shell/TopBar.tsx#BackButton`
- `components/shell/TabBar.tsx` — bottom glass tab bar (Feed / Sandbox / Ledger / Me)
- `components/ui/Pill.tsx` — mono uppercase pill + `NewDot`
- `components/brief/Diff.tsx` — git-style before/after diff
- `components/brief/Markdown.tsx` — tiny zero-JS markdown renderer (h2 / p / table / inline em+strong)
- `lib/cn.ts` — `clsx + tailwind-merge` helper
- `lib/greeting.ts` — time-aware greeting in en / lg / run / luo / ate

### Added — content
- 5 seed Briefs in `/content/updates/`:
  - `chemistry-construct-weights-jun-2026.mdx`
  - `a-level-grading-2026.mdx`
  - `kiswahili-aoi-bank-apr-2026.mdx`
  - `ict-practical-assessment-feb-2026.mdx`
  - `history-topic-merge.mdx`
- Each carries: full schema frontmatter, 5-section structured body, 3 sandbox exercises with construct rubrics

### Added — routes
- `/` → redirects to `/feed`
- `/feed` — chronological list of all Briefs
- `/feed/[slug]` — the Brief (statically generated for all 5)
- `/feed/[slug]/sandbox` — Sandbox preview (full interactivity arrives in Phase D)
- `/sandbox`, `/ledger`, `/me` — placeholder pages with serif-italic empty states
- `not-found.tsx` — *"That page is not in this term's syllabus."*

### Added — content layer
- `lib/content/types.ts` — `CurriculumUpdate`, `SandboxExercise` types (mirrors DB schema in `docs/data-architecture.md`)
- `lib/content/loader.ts` — reads `../content/updates/*.mdx` at build time, sorts by `publishedAt`

### Ops
- Installed pnpm 9.15 to `~/.local/share/pnpm`
- Initialized git at workspace root, remote = `https://github.com/raufabdaal/sasa.git`
- Author config: `Sasa <founder@sasa.ug>` (placeholder — change when you push)

### Fixed
- Migrated `themeColor` from `metadata` export to `viewport` export (Next 16 deprecation)

### Verified
- ✅ `pnpm build` passes
- ✅ All 18 routes prerender as static HTML
- ✅ Zero TypeScript errors
- ✅ Server responds 200 on `/feed`

### Decision
- **D-006** is now accepted: `web/` monorepo subfolder confirmed

---

## [0.0.2] — 2026-06-19 — *Operational Scaffolding*

### Added
- `CHANGELOG.md` — this file
- `STATUS.md` — live project state board
- `HANDOFF.md` — end-of-session handoff template
- `ops/SECRETS_AND_KEYS.md` — every API key + step-by-step setup
- `ops/MANUAL_TASKS.md` — checklist of things only the founder can do
- `ops/DECISIONS.md` — architectural decision log (ADR-style)
- `ops/SESSION_RITUAL.md` — the 3-command start/end ritual
- `.env.example` — environment variable template with comments

### Docs
- README updated to point to the operational docs

---

## [0.0.1] — 2026-06-19 — *Founding Spec*

### Added
- `README.md` — workspace orientation
- `docs/PRD.md` — Product Requirements Document
- `docs/design-philosophy.md` — "Quiet sophistication" design system
- `docs/data-architecture.md` — 4-phase hybrid ingestion plan + universal `CurriculumUpdate` schema
- `docs/user-flows.md` — six annotated user journeys
- `prompts/master-build-prompt.md` — self-contained mega-prompt for AI coding agents
- `prompts/screen-by-screen-prompts.md` — 7 granular per-screen prompts
- `index.html` — single-page visual spec preview

### Decision
- **D-001:** Tech stack (Next.js 15+ / Tailwind v4 / Drizzle / Neon / Clerk / Anthropic / R2 / Vercel)
- **D-002:** Hybrid ingestion (mock → AI extraction → scraping → partnership)
- **D-003:** v1 is teachers-only; Families is a separate later product

---

## How to write a good changelog entry

**Bad:** `fixed bug`
**Good:** `Fixed Brief audio player not resuming after offline reconnect on Android Chrome (file: app/(app)/feed/[slug]/AudioPlayer.tsx)`

Always include:
1. **Category** (Added / Changed / Fixed / etc.)
2. **What** changed
3. **Why** (if not obvious)
4. **Where** (file or area)

Keep entries short but specific. Future-you and the next person will thank present-you.
