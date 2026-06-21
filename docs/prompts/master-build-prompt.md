# MASTER BUILD PROMPT
### For: An AI coding agent (Claude Code, Cursor Agent, v0, Lovable, Devin, or a human engineering team)
### Project: Sasa — Teacher Retooling Platform for the Ugandan Competency-Based Curriculum

---

> **Copy-paste everything between the `=====` lines into your AI coding tool of choice.**

================================================================================

# Your Mission

You are building **Sasa**, an EduTech platform for Ugandan secondary school teachers who are struggling to adapt to the new **Competency-Based Curriculum (CBC)** rolled out by NCDC and assessed by UNEB. Teachers receive curriculum updates (circulars, revised construct weights, new sample papers, retooling slides) constantly, and have **nowhere to go** to understand what changed, why, and how to teach it next Monday.

Sasa turns every official NCDC/UNEB update into a **7-minute bite-sized brief** followed by a **hands-on Sandbox exercise** with AI feedback, and tracks each teacher's mastery in a beautiful **Ledger** that can be exported as a *Retooling Passport* PDF.

This document is the complete spec. Build it.

---

# The Four Pillars of the Product

1. **The Feed** — A calm chronological list of curriculum updates filtered to the teacher's subjects. One card = one change.
2. **The Brief** — Tap a card → opens a 7-minute structured reader: *Context → The Change → Why → Classroom Example → Common Pitfall*. With audio narration option.
3. **The Sandbox** — At the end of every Brief, the teacher applies the new knowledge in a simulation (re-grade a student's work / rewrite an old-style question / plan a 5-min lesson opener). AI grades against official construct descriptors and gives calm, citation-first feedback.
4. **The Ledger** — A quiet record of every update internalized. Exportable as a serif-typeset PDF "Retooling Passport" the teacher can hand to their head teacher.

---

# Non-Negotiable Design Principles

Read these. Then re-read them. They are the product.

1. **Quiet sophistication.** Apple-grade restraint. The user should never say *"wow, flashy"* — they should use it for two weeks and slowly notice the craftsmanship. No confetti. No badges. No leaderboards. No gamification clichés. No "AI sparkle" icons.
2. **Liquid glass surfaces** only on things that float (top nav, audio player, modal sheets). Everything else is flat warm paper.
3. **Restraint is respect.** Teachers in Uganda are told constantly that they are "the problem." Every pixel must communicate *you are a professional, this was made for you.*
4. **Content is the hero.** Chrome recedes. Type does 70% of the visual work. If you removed all color and borders, the hierarchy must still hold.
5. **Motion is physical, never decorative.** Springs not eases. Default `{ stiffness: 380, damping: 32, mass: 0.9 }`. Max 400ms. Never repeats. Every transition has a job: spatial continuity, state change, or attention.
6. **Mobile-first, offline-capable.** Target: a Tecno phone on 1GB of data with spotty Wi-Fi. <200 KB initial JS bundle. PWA installable. Skeleton loaders, never spinners.
7. **No stock photos. No illustrations. No mascots. No flags. No "African pattern" decorations.** Premium *is* the respect.
8. **Audio is content, not chrome.** No sound effects ever. The narrator (later, a real Ugandan voice; for now, a tasteful TTS) speaks the Brief.

---

# Visual System

## Color (use CSS variables)
```css
:root {
  --paper: #FAF8F4;          /* warm off-white base */
  --paper-2: #F2EFE8;        /* card surface */
  --ink: #1A1A1A;            /* primary text */
  --ink-2: #4A4742;          /* secondary text */
  --ink-3: #8A857C;          /* tertiary text */
  --line: rgba(0,0,0,0.08);  /* hairlines */

  /* Section accents — ONE per screen, never combined */
  --accent-feed: #1A1A1A;    /* ink */
  --accent-brief: #2B2118;   /* bound book */
  --accent-sandbox: #8B4A2B; /* clay */
  --accent-ledger: #7A6233;  /* brass */
}

[data-theme="dark"] {
  --paper: #0E0C0A;
  --paper-2: #18150F;
  --ink: #F2EEE6;
  --ink-2: #B8B2A6;
  --ink-3: #75716A;
  --line: rgba(255,255,255,0.08);
}
```

## Liquid Glass (only floating surfaces)
```css
.glass {
  background: rgba(250, 248, 244, 0.72);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  box-shadow:
    inset 0 0.5px 0 rgba(255, 255, 255, 0.6),
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.06);
}
```

## Typography
- **UI**: Inter (variable). Weights: 400, 500, 600. Tight tracking on headlines (`-0.02em`).
- **Brief reading**: Newsreader (or Source Serif 4 as fallback). Body 18px / 1.6 / max 68ch.
- **Mono accents**: JetBrains Mono, 13px. Used in Ledger metadata and the before/after diff only.
- Never use: display fonts, script fonts, "trendy" Google Fonts.

## Iconography
**Lucide icons**, stroke 1.25px. No custom icons in v1 except: the Sasa wordmark, and a 4-cell "Construct" glyph (a 2x2 grid).

## Motion presets (Framer Motion)
```ts
export const spring = { type: 'spring', stiffness: 380, damping: 32, mass: 0.9 };
export const springSoft = { type: 'spring', stiffness: 220, damping: 28, mass: 1.0 };
export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: spring,
};
```

---

# Tech Stack (use exactly this)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, RSC) + TypeScript strict |
| Styling | Tailwind v4 with CSS variables above |
| UI primitives | shadcn/ui — but **restyle every component** to match Sasa system, do not ship defaults |
| Motion | Framer Motion |
| State | Zustand (client) + React Server Components (server) |
| DB | Postgres (Neon) + Drizzle ORM |
| Auth | Clerk (phone OTP + email) |
| Content (v1) | MDX in `/content/updates/*.mdx` with Zod-validated frontmatter |
| AI | Anthropic Claude Sonnet for Sandbox grading |
| TTS | ElevenLabs (later swap for local UG voice) |
| Offline | Workbox service worker + IndexedDB |
| Analytics | PostHog |
| Hosting | Vercel |

---

# Data Schema (Drizzle / TypeScript)

```ts
// CORE — every curriculum update
export const curriculumUpdates = pgTable('curriculum_updates', {
  id: text('id').primaryKey(),                  // ulid
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),           // < 140 chars
  bodyMdx: text('body_mdx').notNull(),

  level: text('level', { enum: ['O-Level','A-Level','Primary'] }).notNull(),
  subjects: jsonb('subjects').$type<string[]>().notNull(),
  grades: jsonb('grades').$type<string[]>().notNull(),
  constructs: jsonb('constructs').$type<('Knowledge'|'Skill'|'Application'|'Values')[]>().notNull(),
  topics: jsonb('topics').$type<string[]>().notNull(),

  changeType: text('change_type', {
    enum: ['addition','removal','revision','clarification','assessment']
  }).notNull(),

  diffBefore: text('diff_before'),              // markdown
  diffAfter: text('diff_after').notNull(),
  diffRationale: text('diff_rationale').notNull(),

  sourcePublisher: text('source_publisher', { enum: ['NCDC','UNEB','MoES'] }).notNull(),
  sourceDocTitle: text('source_doc_title').notNull(),
  sourceDocUrl: text('source_doc_url'),
  sourceDocHash: text('source_doc_hash'),
  sourceIssuedDate: timestamp('source_issued_date').notNull(),
  ingestedVia: text('ingested_via', { enum: ['manual','admin_upload','scrape','partner_api'] }).notNull(),

  effectiveDate: timestamp('effective_date').notNull(),
  expiresDate: timestamp('expires_date'),

  estimatedReadMinutes: integer('estimated_read_minutes').notNull(),
  audioUrl: text('audio_url'),

  sandboxExercises: jsonb('sandbox_exercises').$type<SandboxExercise[]>().notNull(),

  status: text('status', { enum: ['draft','in_review','published','archived'] }).notNull(),
  publishedAt: timestamp('published_at'),
  aiContribution: real('ai_contribution').notNull().default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  firstName: text('first_name').notNull(),
  preferredGreetingLang: text('preferred_greeting_lang').default('en'),
  level: text('level').notNull(),
  subjects: jsonb('subjects').$type<string[]>().notNull(),
  grades: jsonb('grades').$type<string[]>().notNull(),
  schoolId: text('school_id'),
  district: text('district'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userUpdateProgress = pgTable('user_update_progress', {
  userId: text('user_id').notNull().references(() => users.id),
  updateId: text('update_id').notNull().references(() => curriculumUpdates.id),
  readAt: timestamp('read_at'),
  sandboxCompletedAt: timestamp('sandbox_completed_at'),
  sandboxAlignmentScore: real('sandbox_alignment_score'),  // 0-1
  ledgerAddedAt: timestamp('ledger_added_at'),
}, t => ({ pk: primaryKey(t.userId, t.updateId) }));

type SandboxExercise = {
  id: string;
  type: 'regrade' | 'rewrite' | 'plan_opener' | 'design_aoi' | 'identify_construct';
  promptMdx: string;
  referenceMaterial: string;
  rubric: {
    knowledge: { weight: number; descriptor: string };
    skill: { weight: number; descriptor: string };
    application: { weight: number; descriptor: string };
    values: { weight: number; descriptor: string };
  };
  estimatedMinutes: number;
};
```

---

# Routes (App Router)

```
app/
├─ (marketing)/                       — public, server-rendered
│   ├─ page.tsx                       — landing
│   └─ for-schools/page.tsx
├─ (auth)/
│   ├─ sign-in/[[...sign-in]]/page.tsx
│   └─ onboarding/page.tsx            — 4-step subject/school/greeting
├─ (app)/                             — authenticated shell
│   ├─ layout.tsx                     — bottom tab bar (Feed | Sandbox | Ledger | Me)
│   ├─ feed/page.tsx
│   ├─ feed/[slug]/page.tsx           — the Brief
│   ├─ feed/[slug]/sandbox/page.tsx   — the Sandbox
│   ├─ ledger/page.tsx
│   ├─ ledger/export/route.ts         — PDF generation
│   └─ me/page.tsx                    — settings (9 items, max)
└─ (admin)/
    └─ admin/
        ├─ ingest/page.tsx             — upload + extract
        ├─ review/[id]/page.tsx        — human review console
        └─ publish/page.tsx
```

---

# What to Build, in Order

### Phase A — Foundation (Day 1)
1. Init Next.js 15 + Tailwind v4 + TypeScript strict
2. Set up the design system: CSS variables, fonts (next/font for Inter + Newsreader), shadcn init
3. Build the **shell** — bottom tab bar with glass surface, smooth tab transitions
4. Seed 5 mock `CurriculumUpdate` MDX files in `/content/updates/`

### Phase B — The Feed (Day 2)
1. Feed page — chronological cards, filtered by user subjects
2. Card design: subject pill (small, monospace), title (serif if it's a Brief, sans if it's an admin note), read time, "New" dot
3. Tap → route transition with shared element animation (the card "grows" into the Brief)

### Phase C — The Brief (Day 3)
1. MDX renderer with custom components: `<Diff before={...} after={...} />`, `<Construct grid={...} />`, `<Pitfall>...</Pitfall>`
2. Audio player (liquid glass, bottom)
3. Reading progress (1px line at top)
4. Section sticky header that updates as user scrolls
5. End: "Try it in the Sandbox →"

### Phase D — The Sandbox (Day 4–5)
1. Three exercise types: `regrade`, `rewrite`, `plan_opener`
2. Construct rubric input (4-cell grid: K/S/A/V each with A–E selector)
3. API route `/api/sandbox/grade` — calls Claude Sonnet with the rubric, returns calm prose feedback
4. Inline feedback (no modal). The exact words "wrong" / "incorrect" are forbidden.

### Phase E — The Ledger (Day 6)
1. Ledger page — completed updates, streak dot (rings = consecutive weeks), monospace metadata
2. PDF export route — use `@react-pdf/renderer`, typeset like a university transcript

### Phase F — Polish (Day 7+)
1. Offline / PWA (Workbox)
2. The "card falls into Ledger" one-time animation on first completion
3. Onboarding (4 screens)
4. Admin ingest console (Phase 2 ingestion — upload PDF → Claude extracts → human reviews)
5. Audio TTS pipeline

---

# Mock Content to Seed (write these as MDX files)

Create 5 starter Briefs based on real 2024–2026 NCDC/UNEB activity:

1. **`a-level-grading-2026.mdx`** — A-Level moves from numerical (1–9) to A–E construct-based grading (March 2026 NCDC announcement)
2. **`chemistry-construct-weights-jun-2026.mdx`** — O-Level Chemistry construct weights revised from 40/30/30 to 30/30/40
3. **`kiswahili-aoi-bank-apr-2026.mdx`** — New official Kiswahili Activities of Integration sample bank released
4. **`ict-practical-assessment-feb-2026.mdx`** — ICT practical assessment new guidelines
5. **`history-topic-merge.mdx`** — History & Political Education: colonial-era and liberation-struggle topics merged into a single thematic arc

Each MDX file must include all schema fields in frontmatter, a complete Brief body following the 5-section structure (*Context / The Change / Why / Classroom Example / Common Pitfall*), and 3 sandbox exercises.

---

# Voice & Copy Rules

- Plain Ugandan English. No Americanisms ("y'all", "awesome"). No Britishisms either.
- Address the teacher as a colleague, never as a student.
- The word **"engagement"** is banned from the UI.
- The phrase **"Did you know?"** is banned.
- Empty states: a single sentence in serif italic, centered, with one action.
- Errors: name the problem in one sentence, offer one action.
- 404: "That page is not in this term's syllabus."

---

# The "If You Know, You Know" Details (build these)

1. The Construct glyph (2x2 grid) appears anywhere we render a construct rubric. Same visual language everywhere.
2. Time-aware greeting on home: 6 AM = "Wasuze otya, Nakato." 6 PM = "Good evening, Nakato." No exclamation marks.
3. Streak dot grows rings — at 52 weeks it looks like Saturn.
4. Loading = skeletons. Never spinners.
5. The Ledger export PDF looks like a university transcript: serif caps name, monospace metadata, brass-color accent rule.
6. The "before/after" diff renders like `git diff` — red strikethrough, green addition, monospace.
7. The Sandbox feedback always cites the official construct descriptor *first*, then comments on the teacher's response.
8. AI contribution percent is shown on every Brief: *"Drafted by AI from NCDC circular 2026/03, reviewed by [Editor]. AI contribution: 0.7."*

---

# Acceptance Criteria for v1

- [ ] A new teacher can onboard in under 2 minutes on a phone
- [ ] The Feed shows updates filtered to their subjects, newest first
- [ ] A Brief is readable in 7 minutes, with audio option
- [ ] The Sandbox grades a submission against a real rubric via Claude, returning citation-first prose feedback
- [ ] Completing a Brief + Sandbox adds it to the Ledger with the falling-card animation
- [ ] The Ledger exports a PDF that looks like a university transcript
- [ ] The app is installable as a PWA and works offline after first sync
- [ ] Lighthouse: Performance ≥ 90 on Moto G4 throttling, Accessibility ≥ 95
- [ ] No screen ships if a senior teacher at King's College Budo would be embarrassed to open it in the staffroom.

---

# Final Note to the Builder

This product matters. Ugandan teachers are being blamed for a system failure that wasn't theirs. Make this beautiful enough that opening it feels like respect.

================================================================================

> **End of master prompt.**
