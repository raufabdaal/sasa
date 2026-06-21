# Sasa · The Checklist

> **One glance, full picture.** What's done, what's in progress, what's blocked, what's left.
> Updated every session. For context behind any item, see `STATUS.md` / `CHANGELOG.md` / `docs/spec/DESIGN_DEVIATIONS.md`.

**Legend**
- ✅ Done
- 🟡 In progress / partly done
- ⏭️ Next up (no blocker)
- 🔒 Blocked on a manual task (founder action needed)
- 💤 Deferred to a later phase by design
- 🆕 Just added recently

---

## 🧱 Foundation

- ✅ Project name, package manager, GitHub repo decided (MT-001/002/003)
- ✅ Workspace structure cleaned up (`app/`, `content/`, `docs/`)
- ✅ One-command launcher (`launch.sh` / `launch.bat`)
- ✅ `START_HERE.md` onboarding doc
- ✅ Session ritual + handoff system (CHANGELOG / STATUS / HANDOFF)
- ✅ Manual tasks tracking system (`docs/ops/MANUAL_TASKS.md`)
- ✅ Architecture decision log (`docs/ops/DECISIONS.md`)
- ✅ Design deviation log (`docs/spec/DESIGN_DEVIATIONS.md`)
- ✅ `.env.example` + step-by-step secrets guide
- 🔒 First commit pushed to GitHub (MT-060). Waiting on founder

---

## 📘 Specification (the brief)

- ✅ Full PRD (`docs/spec/PRD.md`)
- ✅ Design philosophy v1 superseded by v2 (warm + functional)
- ✅ Design deviations DEV-001 through DEV-015 logged
- ✅ Data & ingestion architecture (4 phases)
- ✅ User flows (6 journeys)
- ✅ Universal `CurriculumUpdate` schema
- ✅ Master build prompt for AI agents
- ✅ Screen-by-screen prompts
- ✅ Visual mockup (`docs/visual-mockup.html`)
- ✅ Interactive preview (`preview.html`) with phone + desktop views

---

## 🎨 Design system (v2.1 warm cream + coral)

- ✅ Warm cream foundation `#F7F2E8`
- ✅ Coral primary CTA `#FF7F5C` with shadow + glow
- ✅ Peach secondary, sage for "done", gold for celebration
- ✅ 8-color subject palette (Chem/Bio/Kis/ICT/Hist/Math/Eng/All)
- ✅ Fraunces serif + Inter sans + JetBrains Mono
- ✅ Real solid buttons (`.btn-primary`, `.btn-secondary`, `.btn-ghost`)
- ✅ Cards with proper shadows
- ✅ Highlighted-quote pull-out (coral left border)
- ✅ Subject-coded chips (`<SubjectChip />`) + dots
- ✅ Liquid glass refined (28px blur, brighter edge)
- ✅ Responsive desktop layout (DEV-007)
- ✅ Readability bumped to 18.5px serif body
- ✅ Coral active-tab pill in mobile TabBar
- ✅ Coral streak Saturn with soft glow
- ✅ Em dashes purged from all user-facing copy (DEV-011)

---

## 🖥️ Screens, what's clickable today

### Public / auth
- ✅ `/` redirects via localStorage (first-time visitors go to onboarding, returning go to feed)
- ✅ `/onboarding`, full 4-step flow with localStorage persistence
- ✅ `not-found`, *"That page is not in this term's syllabus."*

### App shell
- ✅ Mobile: bottom liquid-glass TabBar (4 tabs)
- ✅ Desktop: 240px glass sidebar with brand, nav, and "What I teach" footer
- ✅ Responsive switching at lg: breakpoint

### Feed
- ✅ Mobile: chronological cards, recommended-on-top
- ✅ Desktop: 2-column grid, hero greeting, larger recommended card
- ✅ Color-coded subject chips
- ✅ Coral "Start here" tag
- ✅ Empty state with action
- ⏭️ Search across past updates
- ⏭️ Filter by subject

### Brief (reader)
- ✅ Mobile: single column, 18.5px serif body, 5-section structure
- ✅ Desktop: 2-column with sticky right rail (metadata + actions)
- ✅ Highlighted-quote pull-outs (peach + coral border)
- ✅ Sage/cream "Before/After" diff
- ✅ Big confident coral CTA at the bottom
- ✅ AI contribution transparency note
- ✅ Speaker + Save icons with "Coming soon" toast (DEV-014)
- ⏭️ Scroll-spy section labels in top bar
- ⏭️ Reading progress 1px line at top

### Sandbox
- ✅ **Fully interactive** with A-E grade buttons, Submit, inline feedback
- ✅ 3 exercises per Brief (re-grade is fully built)
- ✅ Progress bar (segments turn coral, then sage as you complete)
- ✅ Citation-first stand-in feedback (real AI in Phase D)
- ✅ Sandbox tab (no dead end), shows recommended + "Or pick another"
- ✅ **Completion celebration** with gold pulse, "You're done", and clear next-step CTAs
- 🔒 Real AI grading (Phase D, needs MT-010 free Groq key)
- ⏭️ `rewrite` / `plan_opener` / `design_aoi` / `identify_construct` exercise UIs

### Ledger
- ✅ Greeting hero, streak Saturn with coral glow
- ✅ Preview rows (muted, with "Sample data" label)
- ✅ "Begin your Ledger" coral-tinted CTA card
- 💤 Real progress tracking (Phase F, needs auth + DB)
- 💤 PDF Retooling Passport export (Phase E)

### Profile / Me
- ✅ Avatar + name + school
- ✅ "What I teach" chips card
- ✅ Honest settings (3 real rows: Subjects & grades, Greeting language, Sign out)
- ✅ "Coming soon" group with Phase E/F labels
- 💤 Real auth-backed identity (Phase F)

---

## 🤖 AI (Phase D, FREE PATH)

- ✅ Sandbox UI fully scaffolded
- ✅ Pre-written citation-first stand-in feedback (matches AI voice)
- ✅ Construct rubrics defined in every MDX Brief
- ✅ Free-tier architecture decided (Groq primary, Gemini fallback) (DEV-012)
- 🔒 Groq API key (MT-010, FREE no card)
- 🔒 Gemini API key (MT-011, FREE no card)
- ⏭️ Server action `/api/sandbox/grade` with provider abstraction
- ⏭️ System prompt + few-shot examples
- ⏭️ Rate limit handling + fallback chain
- ⏭️ Dispute / disagreement flow
- 💤 Anthropic Claude (paid, deferred until budget)

---

## 🗄️ Backend (Phase F, DEFERRED)

> v0 ships with no backend. Profile lives in localStorage. (DEV-013)

- ✅ Schema designed (Drizzle TypeScript)
- ✅ Universal `CurriculumUpdate` shape locked
- ✅ localStorage v0 path implemented for onboarding + profile
- 💤 Clerk auth setup (MT-020, free 10k MAU email-only when ready)
- 💤 Neon Postgres + Drizzle migrations (MT-021, free tier)
- 💤 Cloudflare R2 for PDFs + audio (MT-022, ~$1/mo when ready)
- 💤 User profile persistence in DB
- 💤 Progress / Ledger persistence in DB
- 💤 Server actions for grading + ledger writes
- 💤 Webhooks (Clerk → user.created)

---

## 🔊 Content & ingestion

- ✅ 5 seed MDX Briefs (em dashes purged)
- ✅ MDX content loader (build-time)
- ✅ 4-phase ingestion architecture documented
- ✅ Read-aloud icon present with "Coming soon" toast (DEV-014)
- 💤 ElevenLabs TTS (MT-023, deferred for budget)
- 💤 Browser-native Web Speech API option (could ship anytime if needed)
- ⏭️ Admin upload UI (Phase 2 ingestion)
- ⏭️ AI extraction pipeline (PDF → structured Brief)
- ⏭️ NCDC + UNEB scrapers (Phase 3)
- ⏭️ NCDC partnership (Phase 4, Year 2)

---

## 🚢 Launch (Phase H)

- 🔒 Vercel project setup (MT-030, free tier)
- 🔒 Domain `sasa.ug` purchase (MT-031, ~UGX 100k/yr)
- 🔒 Production env vars set in Vercel (MT-032)
- ⏭️ PWA manifest + service worker (Workbox)
- ⏭️ Offline-first caching of Briefs + Sandbox
- ⏭️ Analytics (PostHog), only after launch
- ⏭️ Terms of Service + Privacy Policy (MT-042)
- ⏭️ Uganda PDPO registration (MT-043)

---

## 🌐 Distribution / growth (post-launch)

- ⏭️ WhatsApp Business account for notifications (MT-051)
- ⏭️ First-school partnership (MT-052, pilot with 5 teachers)
- ⏭️ NCDC partnership conversation (MT-041)
- ⏭️ Source NCDC + UNEB official documents (MT-040)
- ⏭️ Founder email + ops email (MT-050)

---

## 🔑 Manual tasks the founder needs to do

*(Full instructions in `docs/ops/MANUAL_TASKS.md` and `docs/ops/SECRETS_AND_KEYS.md`)*

### Pre-flight ✅
- ✅ MT-001 Project name (Sasa)
- ✅ MT-002 Package manager (pnpm)
- ✅ MT-003 GitHub repo created

### Pending, no money cost
- ⏳ **MT-010** 🆕 Groq API key (FREE, no card, ~3 min) - unlocks Phase D
- ⏳ **MT-011** 🆕 Gemini API key (FREE, no card, ~3 min) - fallback for Phase D
- ⏳ **MT-060** Push first commit to GitHub (~2 min)

### Deferred (no money, needed later)
- 💤 MT-020 Clerk auth (FREE 10k MAU, when Phase F begins)
- 💤 MT-021 Neon Postgres (FREE tier, when Phase F begins)
- 💤 MT-022 Cloudflare R2 (~$1/mo, when Phase F begins)
- 💤 MT-023 ElevenLabs TTS (free 10k chars/mo OR skip, when budget allows)
- 🔒 MT-030 Vercel setup (FREE, when launching)
- 🔒 MT-031 Domain purchase (~UGX 100k/yr, when launching)
- 🔒 MT-040 Gather NCDC/UNEB PDFs for real ingestion
- 🔒 MT-042 ToS + Privacy Policy (use a generator OR ~UGX 500k legal)
- 🔒 MT-043 Uganda PDPO registration (legal, before public launch)

---

## 📊 At-a-glance status

| Category | Done | Left |
|---|---|---|
| Foundation | 10 | 1 |
| Spec | 10 | 0 |
| Design system | 15 | 0 |
| Screens, clickable | 22 | 8 |
| AI (Phase D) | 4 | 6 |
| Backend (Phase F, DEFERRED) | 3 | 8 |
| Content / ingestion | 5 | 6 |
| Launch (Phase H) | 0 | 8 |
| Distribution | 0 | 5 |
| **TOTAL** | **69 done** | **42 left** |

> Done = 62% · Left = 38%
> Of the 42 left, **35 are no-cost** or deferred-by-design.

---

## 🎯 What we're working on right this minute

*(Updated end-of-session by Agent.)*

**Current focus:** v0 has reached a "free-tier complete" state. Em dashes purged. Coming-soon toasts in place for Listen/Save. localStorage onboarding gating live. Completion celebration shipped.

**Next sensible step:** Either
- (a) Founder sets up Groq + Gemini keys (both free) so we can wire real AI Sandbox feedback in Phase D, or
- (b) More free polish (scroll-spy section labels, reading progress line in Brief), or
- (c) Build the remaining Sandbox exercise UIs (`rewrite`, `plan_opener`, etc.) using the stand-in feedback.

---

*Last updated: 2026-06-20 by Agent.*
