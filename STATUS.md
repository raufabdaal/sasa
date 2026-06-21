# Project Status

> **Last updated:** 2026-06-20 (session 2026-06-20-005) by Agent
> **Current phase:** v0 free-tier complete. No budget needed to ship a working showcase.
> **Easiest way to see it:** double-click `preview.html` (Phone + Desktop views)

This file is the **single source of truth** for "where are we right now."
Updated at the **start and end of every session**.

---

## 🎯 The current goal

**Done this session:** Brighter color pops (coral primary CTA + glowing streak), full desktop responsive layout (240px sidebar + content + optional rail), readability bumps (18.5px serif, deeper contrast), honest settings (dropped dead-end rows), refined glass (more blur, brighter edge), AND the 4-step onboarding flow.

**Next goal:** Founder reviews v2.1, then we proceed to Phase D (Anthropic AI grading) when MT-010 is ready. Or further free polish (completion animation, scroll-spy in Brief).

---

## 📊 Phase overview

| Phase | Status | Notes |
|---|---|---|
| Phase 0 — Specs & ops | ✅ Done | |
| Phase A — Foundation | ✅ Done | Next.js + tokens + shell + Feed + Brief |
| Workspace cleanup | ✅ Done | `app/`, `docs/`, `preview.html`, `launch.sh` |
| Design v2 overhaul | ✅ Done | Warm palette, color-coded subjects, interactive Sandbox |
| **Design v2.1 (this session)** | ✅ **Done** | Color pops, desktop layout, readability, honest settings, onboarding |
| Phase B — Feed polish | 🟡 90% | Completion animation, search still TODO |
| Phase C — Brief polish | 🟡 90% | Scroll-spy section labels, audio player visual still TODO |
| **Phase D — Sandbox AI** | ⏭️ Awaits MT-010 | All scaffolding in place; swap stand-in feedback for real Claude |
| Phase E — Ledger + PDF | 🔜 | After D |
| Phase F — Auth + DB + TTS + PWA | 🔜 | MT-020/021/022/023 |
| Phase G — Admin ingest | 🔜 | After F |
| Phase H — Deploy | 🔜 | MT-030/031/032 |

---

## ✅ Done this session

### Spec
- [x] Logged DEV-006 through DEV-010 in `DESIGN_DEVIATIONS.md`

### Tokens (v2.1)
- [x] `--coral`, `--coral-soft`, `--coral-deep` added — new primary CTA color
- [x] `--gold-bright`, `--gold-soft` added — celebratory accents
- [x] Deepened `--sage` and `--ink-2` for stronger contrast
- [x] Body serif: 17.5px → 18.5px, line-height 1.65 → 1.7
- [x] `.btn-primary` switched from peach to coral (with `.btn-peach` available for secondary-prominent)
- [x] `.highlight-quote` gets coral left border
- [x] `.tag-coral`, `.tag-soft` chip utilities
- [x] Refined `.glass` and `.glass-bottom` (more blur, brighter edge)
- [x] New `.glass-side` for desktop sidebar

### Desktop layout (NEW)
- [x] `app/src/components/shell/SideNav.tsx` — sticky 240px glass sidebar
- [x] `app/src/app/(app)/layout.tsx` — grid layout switching at lg:
- [x] `TabBar` gets `.tabbar-mobile-only` (hides on desktop)
- [x] Feed: 2-col grid + larger recommended card on desktop
- [x] Brief: 2-col with sticky right rail (metadata + actions)
- [x] All other tabs: responsive padding + max-widths

### Honest settings (DEV-009)
- [x] Removed "About Sasa" (no such page)
- [x] Demoted Notifications, Download-offline, Export-Passport to "Coming soon" with Phase labels
- [x] Active settings now: Subjects & grades, Greeting language, Sign out

### Onboarding (NEW)
- [x] `/onboarding` route at `app/src/app/(auth)/onboarding/page.tsx`
- [x] 4-step client flow with progress dots (sage = done, coral = current, cream-3 = future)
- [x] Step 1: Level → Subjects (max 6) → Grades, progressive disclosure
- [x] Step 2: School free-text + 10-school typeahead matches
- [x] Step 3: First name + greeting language with **live greeting preview**
- [x] Step 4: "6 updates behind" finale with 2-CTA stack
- [x] Honest helper copy

### Preview file
- [x] Phone/Desktop view toggle
- [x] Full desktop mockup with browser chrome, sidebar nav, and main content
- [x] Interactive Sandbox works in both views
- [x] Glowing coral streak Saturn

### Verified
- [x] `pnpm build` passes — 19 routes

---

## 🟡 In progress
*(nothing — handing back to founder)*

---

## ⏭️ Next (priority order)

### Founder action
1. **Review v2.1 design** — open `preview.html`, toggle to Desktop view, test the Sandbox interactivity

### Optional polish (free)
2. Completion animation when last Sandbox exercise finishes (gold pulse + "Added to Ledger" toast)
3. Scroll-spy section labels in Brief top bar
4. Audio-player pill visual (no real TTS yet)

### Phase D — needs MT-010 (Anthropic key)
5. Swap pre-written Sandbox feedback for real Claude API
6. Build `rewrite`, `plan_opener`, `design_aoi`, `identify_construct` exercise UIs
7. Server actions + rate limiting

---

## 🔴 Blocked
*(nothing)*

---

## 🔑 Keys & accounts

| Service | For | Status |
|---|---|---|
| Anthropic API | Phase D | ⏳ MT-010 |
| Clerk | Phase F | ⏳ MT-020 |
| Neon Postgres | Phase F | ⏳ MT-021 |
| Cloudflare R2 | Phase F | ⏳ MT-022 |
| ElevenLabs | Phase F (optional) | ⏳ MT-023 |
| Vercel | Phase H | ⏳ MT-030 |
| Domain | Phase H | ⏳ MT-031 |

---

## 📋 Manual tasks status

- **MT-001** ✅ Project name: Sasa
- **MT-002** ✅ Package manager: pnpm
- **MT-003** ✅ Repo: https://github.com/raufabdaal/sasa.git
- **MT-060** ⏳ Push commits to GitHub
- **MT-010+** ⏳ Service keys (when ready)

---

## 📝 Notes from this session

- Founder approved v2 with feedback for v2.1: brighter pops + desktop layout + readability + honest settings + onboarding
- All five logged as DEV-006 to DEV-010 in `DESIGN_DEVIATIONS.md` (founder's "keep track" rule honored)
- Coral `#FF7F5C` is now the PRIMARY CTA color — it punches harder than peach without being aggressive. Peach `#F0A878` stays available as `.btn-peach` for secondary-prominent actions.
- Desktop layout uses Tailwind `lg:` prefix throughout — zero impact on mobile design, only adds desktop affordances above 1024px.
- Onboarding is honest about itself: "You can change all this later in Profile." No false sense of permanence.
- The "live greeting preview" in onboarding step 3 is the small "if you know you know" detail — type your name, see *"Wasuze otya, [Your Name]."* appear in a coral-edged peach card. It's the moment you realize the app remembers you.
