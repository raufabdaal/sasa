# Sasa · Lessons Learned

> Project-specific lessons from building Sasa. For general vibe-coding wisdom that applies to ALL projects, see `~/dev-handbook/DEV_JOURNAL.md`.

> **For agents joining this project:** read `AGENT_BRIEF.md` (in `~/dev-handbook/`) for how the founder works, then read `STATUS.md` for current state, then this file for Sasa-specific context. Append to the bottom of this file when we learn something new about THIS project.

---

## What this project IS

A retooling platform for Ugandan secondary school teachers adapting to the new Competency-Based Curriculum (CBC). Turns every NCDC circular and UNEB update into a 7-minute Brief + hands-on Sandbox exercise + Retooling Passport PDF.

## What this project IS NOT (and why)

- ❌ Not student-facing. That's a separate future product (Sasa for Families).
- ❌ Not free for schools (eventually). Teachers always free; revenue from schools, NGOs, eventually NCDC.
- ❌ Not a content marketplace. We curate, we don't host UGC.
- ❌ Not gamified. No badges, no points, no leaderboards. Restraint is respect.

---

## The 5 hardest lessons we learned building Sasa

### 1. The first design direction was wrong

We started with "Apple-restrained, quiet sophistication." It looked beautiful in mockups, felt soulless in the actual product. Real Ugandan teachers don't want a museum; they want a really well-made notebook.

**The fix:** v2 design — warm cream foundation, peach/coral accents, color-coded subjects, real solid buttons, highlighted-quote pull-outs, friendlier serif (Fraunces).

**Tracked in:** `docs/spec/DESIGN_DEVIATIONS.md` DEV-001 through DEV-010

### 2. Restraint can become starvation

The v1 had: hairline buttons (looked decorative, not tappable), dead-end empty states ("Open a Brief to start..." with no action), tiny mono-uppercase labels everywhere (felt like a CLI tool). Restraint without function is just bad UX.

**The fix:** real solid buttons. Every empty state has a clear next action. Mono-uppercase labels reserved for actual content section markers.

### 3. Em dashes in 2026 read as AI

Used em dashes liberally in early copy. Founder pointed out they're now widely seen as "AI tells." Purged from all user-facing text. Kept in internal docs.

### 4. Budget assumed wrong: we didn't need paid AI

Original plan: paid Anthropic Claude for Sandbox grading (~$20 to start). Founder had no budget. Switched to Groq (Llama 3.3 70B, free, no credit card) + Gemini fallback. Quality is sufficient. Pluggable architecture means we can swap to Claude later in one env var change.

**Tracked in:** DEV-012, `docs/ops/SECRETS_AND_KEYS.md`

### 5. Vercel deploy of a monorepo-style project requires explicit settings

Next.js app lives in `app/` subfolder, content in sibling `content/` folder. Vercel's auto-detect failed silently. The fix: explicitly set Framework Preset to "Next.js" AND enable "Include source files outside of the Root Directory in the Build Step".

**Tracked in:** The Lessons Log at the bottom of this file (2026-06-21 entry)

---

## Project-specific conventions

### Folder layout
```
sasa/
├─ app/                    Next.js app (Vercel Root Directory = "app")
├─ content/updates/        MDX Briefs (sibling to app/, read at build time)
├─ docs/
│   ├─ spec/               PRD, design philosophy v2, deviations, data architecture
│   ├─ ops/                Secrets guide, manual tasks, decisions, session ritual
│   └─ prompts/            AI build prompts for re-use
├─ preview.html            Static demo, double-click to open
├─ launch.bat / launch.sh  One-command dev server
└─ Top-level state files:  STATUS, HANDOFF, CHANGELOG, CHECKLIST, README, START_HERE, LESSONS, .env.example
```

### Design system (v2.1)
- **Foundation:** warm cream `#F7F2E8`, paper `#FFFCF6`
- **Primary CTA:** coral `#FF7F5C` (was peach, deepened for "do this now" pop)
- **Secondary CTA:** peach `#F0A878`
- **Done/completed state:** sage `#5F7A5C`
- **Celebration:** gold `#F2B441`
- **Subject color-coding:** locked in `lib/subjects.ts`. Chemistry=sage, Biology=sage-teal, Kiswahili=peach, ICT=soft-blue, History=clay, Math=lavender, English=gold, All=ink-2
- **Fonts:** Fraunces serif (headlines + body reading), Inter sans (UI), JetBrains Mono (metadata + dates only)
- **Liquid glass:** ONLY on floating surfaces (top bars, tab bar, sidebar). Static content stays flat paper.

### Session ritual (every session, no exceptions)
**Start:** read STATUS → HANDOFF → last CHANGELOG entry → MANUAL_TASKS.
**End:** update CHANGELOG (new dated version), STATUS, HANDOFF (overwritten), DESIGN_DEVIATIONS if we changed our minds, CHECKLIST totals.

### Manual tasks
Numbered `MT-001` upward. Logged in `docs/ops/MANUAL_TASKS.md`. Always include: status, blocker flag (🔒 vs 💤), time estimate, cost, step-by-step.

### Design deviations
Numbered `DEV-001` upward. Logged in `docs/spec/DESIGN_DEVIATIONS.md`. Append-only, never edit historical entries. Format: previous decision → problem → new decision → reasoning → files affected.

---

## Things to never do in this project

- ❌ Use stock photos of African children (or any human stock photos)
- ❌ Use flags, map silhouettes, kente patterns (premium IS the respect)
- ❌ Gamify (no badges, points, leaderboards, confetti)
- ❌ Say "engagement" in any user-facing copy
- ❌ Use em dashes in user-facing copy
- ❌ Ship a dead-end empty state
- ❌ Use the word "wrong" or "incorrect" in AI Sandbox feedback
- ❌ Skip the session ritual

## Things to always do

- ✅ Cite the official NCDC/UNEB descriptor first, before any AI judgment
- ✅ Show "AI contribution: X.X" + reviewer name on every Brief
- ✅ Make the desktop layout proper, not stretched mobile
- ✅ Color-code subjects for fast scanning
- ✅ Give every empty state a clear next action
- ✅ Test the live URL after every deploy, don't trust the build log alone

---

## Sasa-specific Lessons Log

> Append new entries here as we learn things specific to THIS project. For project-agnostic lessons, append to `~/dev-handbook/DEV_JOURNAL.md` instead.

### 2026-06-21 · The Vercel monorepo gotcha (Sasa specifically)
Sasa's structure puts the Next.js app in `app/` and MDX content in a sibling `content/` folder. On the first Vercel deploy this caused two consecutive 404s:

1. **First 404:** Vercel auto-detected the project as "Other" instead of "Next.js" because `next.config.ts` wasn't at the repo root. **Fix:** Settings → Build and Deployment → Framework Preset → set to "Next.js" → redeploy.

2. **Second 404 (empty Feed):** The content loader couldn't find `../content/updates` from Vercel's build sandbox because Vercel only cloned the `app/` folder when Root Directory was set to `app`. **Fix:** Settings → General → Root Directory → enable "Include source files outside of the Root Directory in the Build Step" checkbox → redeploy.

**Permanent safeguard added:** the content loader at `app/src/lib/content/loader.ts` now tries multiple candidate paths AND throws a loud descriptive error if no content is found. Silent failures are worse than loud ones.

### 2026-06-20 · Free-tier AI architecture for Sasa
For Phase D (Sandbox AI grading), we settled on:
- **Primary:** Groq (Llama 3.3 70B Versatile, free tier)
- **Fallback:** Google Gemini 2.0 Flash (free tier)
- **Future paid:** Anthropic Claude Sonnet (deferred, one env var swap)

System prompt template (in `lib/ai.ts` when built):
1. Always cite the NCDC construct descriptor first, verbatim, in quotes
2. Compare teacher's grade to descriptor gently
3. Speak as a respected colleague, not a judge
4. Never use "wrong", "incorrect", "mistake"
5. Max 4 sentences
6. End with one concrete nuance to consider

### 2026-06-20 · Onboarding gating without auth
v0 ships with no real auth. First-visit detection done via `localStorage.sasa.onboarded`. Root page `/` is a client component that checks the flag and redirects: first visit → `/onboarding`, returning visit → `/feed`. Onboarding's finish button writes the flag.

**Tracked in:** DEV-013, DEV-015. When real auth lands in Phase F, the localStorage check gets replaced with a Clerk middleware check on `user.onboarded`.

### 2026-06-19 · The redownload spiral, ended
For two days, founder was downloading the workspace zip after every change, deleting local folder, re-extracting. Wasted hours. Fix: created GitHub repo + connected Vercel + auto-deploy. Now: agent commits → push → Vercel deploys → founder `git pull`s if needed. Cycle time dropped from 30 minutes to 5 seconds.

---

*Last updated: 2026-06-21. Append below this line.*
