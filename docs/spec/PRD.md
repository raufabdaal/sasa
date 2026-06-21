# Product Requirements Document
## Sasa — Teacher Retooling Platform for the Ugandan CBC

**Version:** 0.1 (Founding Spec)
**Date:** June 2026
**Audience:** Founders, designers, engineers, investors
**Status:** Draft for build

---

## 1. The Problem (in the founder's own words)

Uganda rolled out a new **Competency-Based Curriculum (CBC)** for lower secondary in 2020, and is now rolling out the A-Level version in 2026. The change is massive:

- Teaching shifted from *teacher-centered knowledge delivery* to *learner-centered competency building*
- Assessment shifted from one big exam to **continuous Activities of Integration (AOIs)** + a construct-based final
- Grading shifted from numerical distinctions to **A–E descriptors per construct** (knowledge / skill / competency / values)
- Subjects were merged, renamed, or added (e.g. Technology & Design, Performing Arts, compulsory Kiswahili)

The government chose a **cascade training model**: NCDC trained 35% of teachers as "master trainers" who were supposed to train the other 65%. **It didn't work.** A 2024 UNEB study found most teachers were still setting old-curriculum-style questions weeks before the first pioneer exam. The Economic Policy Research Centre called the training "insufficient and too generalised." UNEB itself only arrived to train teachers on assessment a few months before the exam.

**The result:** Students fail not because they're incapable, but because their teachers were never properly retooled.

**The compounding problem:** NCDC and UNEB keep issuing updates — circulars, retooling sessions, new construct descriptors, sample AOIs — and there is **no single place** a teacher can go to find:
1. *What changed since last term?*
2. *What does it mean for my classroom on Monday?*
3. *How do I actually teach it / assess it?*

### Who hurts today
- **The teacher**, who feels professionally inadequate through no fault of their own.
- **The student**, whose grade is a measure of their teacher's training gap.
- **The parent**, who pays fees and watches their child fail an exam the system itself isn't ready for.
- **NCDC / UNEB**, who issue good materials that never reach the classroom.

---

## 2. The Solution

**Sasa** is a mobile-first web platform (PWA, installable, offline-capable) that:

1. **Ingests** every official NCDC/UNEB update — circulars, syllabi revisions, sample papers, construct descriptors, retooling slides — via a hybrid pipeline (manual upload + scrape + AI extraction).
2. **Diffs** each update against the teacher's last-known version of the curriculum, so they only ever read *what's new*.
3. **Synthesizes** the change into a **7-minute bite-sized brief** — written in plain Ugandan English, with examples, and tagged by subject + grade + construct.
4. **Practices** the change in a **Sandbox** — a guided simulation where the teacher applies the new knowledge (e.g., "Re-grade this S3 Biology AOI using the new construct rubric") with instant AI feedback.
5. **Tracks mastery** so a teacher can show — to themselves, their head teacher, or an investor — that they are demonstrably current with the curriculum.

We are **not** a content library. We are a **change-management system for teachers**.

---

## 3. Product Pillars

### Pillar 1 — *"What's new?"* (The Feed)
A single, calm, chronological feed. Each card is one curriculum change. No noise.

### Pillar 2 — *"What does it mean?"* (The Brief)
Every card opens into a 7-minute structured brief: **Context → The Change → Why → Classroom Example → Common Pitfall**.

### Pillar 3 — *"Can I do it?"* (The Sandbox)
Every brief ends with a hands-on simulation: re-write a question, grade a sample student response, plan a 5-minute lesson opener. AI gives feedback against the official construct descriptors.

### Pillar 4 — *"Am I keeping up?"* (The Ledger)
A quiet, beautiful record of every change a teacher has internalized. Exportable as a PDF — a *"Retooling Passport"* — that a teacher can hand to a head teacher or DEO.

---

## 4. Target User (v1)

**Primary persona — "Teacher Nakato"**
- Female, 34, teaches S2 Biology and S3 Chemistry at a UPE-supported secondary school in Mukono
- Trained on the *old* curriculum at Kyambogo, 2014
- Attended *one* NCDC cascade session in 2021 — three days, 200 people in a hall
- Owns a Tecno Camon, has 1GB of data on most days, school has spotty Wi-Fi
- Speaks English fluently but thinks in Luganda
- Earns ~UGX 600,000/month. Will not pay > UGX 5,000/month out of pocket.

**Implication for design:**
- Mobile-first, < 200 KB initial load, full offline mode after first sync
- Audio versions of every brief (for commute / load-shedding)
- Free for teachers — monetization is school/district/NGO/donor (see §10)

**Secondary personas (later):** Head Teacher (dashboard), District Education Officer (compliance view), NCDC partner (publishing console).

---

## 5. Core User Journeys

### Journey A — "I got a UNEB circular yesterday"
1. Teacher opens Sasa. The Feed shows a new card at the top: **"New: O-Level Chemistry construct weights revised (June 2026)."**
2. Tap. A 7-minute brief opens. Reading time + audio toggle visible.
3. Brief explains: *what was 40/30/30 is now 30/30/40, emphasis shifted to "Application of Knowledge"*.
4. A *"Before & After"* table animates in (the moment of "ohhh I see").
5. End of brief → **"Try it"** button → Sandbox loads a real-style AOI and the teacher re-weights a sample grade. AI checks. Confetti is *not* used. A single check mark fades in.
6. Card moves from Feed to Ledger. Streak +1.

### Journey B — "I missed last term"
1. Teacher onboards, picks subjects + grades they teach.
2. Sasa shows: **"You're 6 updates behind. ~38 minutes to catch up."**
3. Teacher does them at their own pace, offline if needed.

### Journey C — "My head teacher wants proof I'm trained"
1. Teacher taps *Ledger → Export*.
2. PDF generated: name, photo, school, list of every change internalized with date + Sandbox score.
3. Looks like an Apple gift receipt. Quiet, undeniable, premium.

---

## 6. Feature List (v1)

### Must-have (MVP, 12 weeks)
- [ ] Email + phone OTP auth
- [ ] Teacher profile (subjects taught × grades, school, district)
- [ ] **The Feed** — chronological curriculum updates, filtered to user's subjects
- [ ] **The Brief** — 7-min structured reader, with audio (TTS), offline-cached
- [ ] **The Sandbox** — at least 3 simulation types:
  - *Re-grade* (apply new rubric to sample student work)
  - *Re-write* (convert an old-curriculum question to CBC)
  - *Plan-an-opener* (5-min lesson opening using the new concept)
- [ ] AI feedback on Sandbox submissions (LLM grader against construct descriptors)
- [ ] **The Ledger** — completed updates, streak, exportable PDF
- [ ] Admin console for ingesting + publishing NCDC/UNEB updates
- [ ] Mock data: 25 realistic updates spanning Biology, Chemistry, Math, History, Kiswahili, Entrepreneurship
- [ ] Installable PWA, offline mode, <200KB initial JS

### Should-have (v1.1)
- [ ] Peer discussion thread per update (moderated)
- [ ] WhatsApp delivery of "new update" notifications
- [ ] Local-language summaries (Luganda, Runyankole, Luo) — auto-translated, teacher-reviewed
- [ ] Search across all past updates

### Won't-have (v1)
- Student-facing content (separate product — Sasa for Families)
- Live video lessons
- Marketplace for teacher-made content
- Direct exam-paper sales (avoid UNEB IP conflict)

---

## 7. Data & Ingestion Architecture (Hybrid)

We need content **now** (for investor demos) and a path to **real automated ingestion** later.

### Phase 1 — Seeded Mock Data (Week 1–2)
- 25 hand-crafted updates modelled on real NCDC circulars + 2024–2026 UNEB releases
- Stored as MDX with frontmatter (subject, grade, construct, effective_date, source_doc_url, change_type)
- Lives in `/content/updates/*.mdx`

### Phase 2 — Admin Upload + AI Extraction (Week 6+)
- Admin uploads PDF/DOCX of an NCDC circular
- LLM pipeline (Claude/GPT) extracts:
  - Affected subjects, grades, constructs
  - Diff vs. previous version of the same syllabus section
  - Suggested 7-min brief draft
  - Suggested sandbox exercises
- Human editor (us, initially) reviews + publishes

### Phase 3 — Active Scraping + Watchers (Month 4+)
- Scheduled scrapes of:
  - `ncdc.go.ug` (publications, news)
  - `uneb.ac.ug` (circulars, past papers)
  - NCDC YouTube channel (transcripts of retooling sessions)
- Hash-based change detection → triggers extraction pipeline
- Editor still reviews before publish (legal + quality)

### Phase 4 — Official Partnership (Year 2)
- MOU with NCDC to become official digital retooling partner
- Direct publish API from NCDC editorial team

> **See `docs/data-architecture.md` for the full diagram.**

---

## 8. Design Philosophy (summary — full doc separate)

**"Quiet sophistication. The work shows itself only to those who look."**

- Apple-grade restraint — generous whitespace, one accent color per screen, type does the heavy lifting
- **Liquid Glass surfaces** — subtle backdrop blur on cards, soft inner shadows, content first
- Motion is *physical*, not decorative — every transition has a reason (spatial continuity, state change, attention)
- No gamification clichés (no badges, no confetti, no leaderboards). The reward is the work itself.
- Local without stereotype — no kente patterns, no map-of-Africa silhouettes. Premium *is* the respect.
- Typography: Inter for UI, a humanist serif (Source Serif / Newsreader) for Brief reading, monospace accents in the Ledger
- Color: warm off-white base, single deep accent that rotates by section (Feed = ink, Brief = paper, Sandbox = clay, Ledger = brass)

> **See `docs/design-philosophy.md` for the full system.**

---

## 9. Tech Stack (recommended)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | RSC for fast first paint on cheap phones |
| Styling | **Tailwind v4 + CSS variables** | Tiny bundle, design tokens |
| UI primitives | **shadcn/ui** (customized hard, no default look) | Headless, accessible |
| Motion | **Framer Motion** + custom spring presets | Physical feel |
| Auth | **Clerk** or **better-auth** | Phone OTP support |
| DB | **Postgres (Neon)** + **Drizzle ORM** | Serverless, cheap |
| Content | **MDX** in repo (v1) → **Sanity** (v2) | Editor-friendly later |
| AI | **Claude Sonnet** (grading) + **OpenAI Whisper** (audio) | Quality + cost |
| Hosting | **Vercel** + Cloudflare in front | Edge for Africa |
| Analytics | **PostHog** (self-hosted) | Privacy + cost |
| Offline | **Workbox** service worker, IndexedDB cache | Real Uganda networks |

---

## 10. Business Model

Teachers will **never** pay (it would defeat the mission and the unit economics).

| Stream | Buyer | Pitch |
|---|---|---|
| **School license** | Private schools (UGX 1.5M/yr per 50 teachers) | Compliance + parent marketing |
| **District/Govt contract** | MoES / district education offices | "Verifiable retooling at 1/40th the cost of in-person" |
| **NGO/Donor sponsorship** | Mastercard Foundation, Aga Khan, Wellspring, FCDO | Per-teacher subsidy |
| **NCDC partnership** | NCDC | Official digital channel — small per-publish fee, huge legitimacy |
| **Parent product** | Families (separate app, Sasa for Families) | Freemium, paid tier ~UGX 10k/month |

---

## 11. Success Metrics

**North Star:** *Number of teachers who internalize a new curriculum update within 7 days of its publication.*

| Metric | 6-month target |
|---|---|
| Active teachers | 5,000 |
| Median time from NCDC publish → teacher completion | < 5 days |
| Sandbox completion rate per brief | > 60% |
| Ledger PDF exports per month | > 1,000 (proxy for institutional value) |
| Schools with ≥ 10 active teachers | 100 |

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| NCDC/UNEB views us as IP infringer | Engage early; position as amplifier; never republish exam content verbatim |
| Teachers don't trust AI feedback | Every Sandbox AI response cites the exact construct descriptor; human review queue for disputes |
| Low connectivity | Aggressive offline-first; <200KB shell; SMS/WhatsApp fallback |
| "Just another EdTech" perception | Design is the moat. Investor demo must feel like Linear, not like a hackathon |
| Cascade trainers see us as a threat | Build a "Master Trainer" tier — they get paid to author briefs |

---

## 13. Open Questions

1. Do we launch with O-Level only, or include the new A-Level rollout (more urgent, smaller TAM)?
2. Do we co-brand with NCDC from day one (slower) or build standalone and earn the partnership (faster, riskier)?
3. Local-language audio — translate or re-record with native teachers?
4. Do head teachers get a paid dashboard, or is it included in school license?

---

*"In Uganda, when the curriculum changes, the teacher is the last one to be told and the first one to be blamed. Sasa changes that."*
