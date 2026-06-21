# Architectural Decision Log

> **Why did we choose X over Y?** This file remembers, so we don't re-litigate decisions every six months.

Format: each decision is one block (ADR-lite — Architectural Decision Record).
Decisions are numbered `D-NNN` and **immutable once accepted.** If we change our mind, we write a NEW decision that supersedes the old one (and link both ways).

---

## D-001 · Tech stack
**Date:** 2026-06-19
**Status:** ✅ Accepted
**Decision:** Next.js 15 (App Router) + TypeScript strict + Tailwind v4 + shadcn/ui (heavily customized) + Drizzle ORM + Neon Postgres + Clerk + Anthropic Claude + ElevenLabs + Cloudflare R2 + Vercel.

**Why:**
- **Next.js 15 + RSC** — fast first paint matters on Tecno phones over 3G in Uganda.
- **Tailwind v4** — tiny bundle, design tokens via CSS variables, no runtime cost.
- **shadcn/ui** — headless and accessible; we restyle every component to match our system (we are NOT shipping default shadcn look).
- **Drizzle** over Prisma — lighter, less magic, edge-friendly.
- **Neon** — serverless Postgres, generous free tier, Frankfurt region is closest to UG.
- **Clerk** — best phone OTP DX; we'll switch if Uganda SMS delivery is unreliable.
- **Anthropic over OpenAI** — Claude's writing voice is calmer and more on-brand for our Brief grading prose.
- **R2 over S3** — zero egress fees (crucial when teachers re-download briefs over expensive data).
- **Vercel** — best Next.js DX; if cost becomes an issue at scale, we self-host.

**Alternatives considered:**
- SvelteKit (smaller bundles, but smaller ecosystem and team unfamiliarity)
- Remix (great, but Next.js RSC story is currently stronger)
- Supabase over Neon+Clerk (one fewer service, but auth UX is less polished)

---

## D-002 · Hybrid data ingestion
**Date:** 2026-06-19
**Status:** ✅ Accepted
**Decision:** 4-phase data strategy. Mock now → admin upload + AI extraction → active scraping → official NCDC partnership.

**Why:**
- We need polished content NOW for investor demos and first 50 teachers.
- We need a path to real, automated, sustainable ingestion.
- We need legitimacy with NCDC/UNEB long-term — building scrapers first earns the relationship.

**Detail:** See `docs/data-architecture.md`.

---

## D-003 · v1 is teachers-only
**Date:** 2026-06-19
**Status:** ✅ Accepted
**Decision:** Teachers are the only user type in v1. Students + parents are a separate later product (working name: *Sasa for Families*).

**Why:**
- Teachers are the leverage point. Fix the teacher and you fix every class they ever teach.
- Mixing teacher-tooling and student-content in one product dilutes both.
- The student product is best when bundled with parent involvement — parents pay, students use, both are accountable. That's a different surface area.

**Reversal cost:** Low. The codebase will be modular enough that an "audience: student" addition is feasible later.

---

## D-004 · Design philosophy: quiet sophistication
**Date:** 2026-06-19
**Status:** ✅ Accepted
**Decision:** Apple-grade restraint. Liquid glass only on floating surfaces. No gamification clichés. Local without stereotypes.

**Why:** See `docs/design-philosophy.md` in full. Short version: respect is the moat. Most African EdTech is loud and condescending; we win by being the opposite.

**Test:** "Would a senior teacher at King's College Budo be embarrassed to open this in the staffroom?" If no → ship.

---

## D-005 · Free for teachers, never paywalled
**Date:** 2026-06-19
**Status:** ✅ Accepted
**Decision:** Individual teachers will never pay for Sasa. Revenue comes from schools, districts, NGOs/donors, and NCDC partnership fees.

**Why:**
- Teachers in Uganda earn ~UGX 600k/month. Asking them to pay is a non-starter ethically and commercially.
- Paywalling defeats the mission (helping the teachers who most need help).
- Schools, districts, and donors all benefit from teacher quality and have real budgets.

---

## D-006 · Repo structure
**Date:** TBD (pending MT-001 + MT-002 + MT-003)
**Status:** ⏳ Proposed
**Proposal:** Monorepo-lite. Spec docs at workspace root, Next.js app in `app/`, future apps (e.g., Families) as siblings (`families/`).

```
sasa/                          ← was sasa-ug in the proposal
├─ START_HERE.md
├─ launch.sh / launch.bat
├─ README.md
├─ CHANGELOG.md
├─ STATUS.md
├─ HANDOFF.md
├─ .env.example
├─ app/                        ← was web/ — the Next.js app
├─ content/                    ← MDX briefs + source PDFs
└─ docs/                       ← was docs/ + ops/ + prompts/ separately
    ├─ spec/
    ├─ ops/
    ├─ prompts/
    └─ visual-mockup.html      ← was /index.html
```

**Update 2026-06-20:** Approved + implemented. The final layout is slightly different from the proposal above — we consolidated docs/ops/prompts under a single `docs/` umbrella for findability. See `START_HERE.md` for the actual tree.

---

## D-007 · No third-party UI libraries beyond shadcn primitives
**Date:** 2026-06-19
**Status:** ✅ Accepted
**Decision:** We don't import any "kitchen sink" UI library (MUI, Mantine, Chakra, etc.).
**Why:** They all have an opinionated default look that fights our design system. We use shadcn primitives (which are unstyled) and write our own components.

---

## D-008 · No analytics until launch
**Date:** 2026-06-19
**Status:** ✅ Accepted
**Decision:** We do not install PostHog/Plausible/anything until we have real users. No analytics in development.
**Why:** It tempts premature optimization. We optimize for what users actually do, not what we imagine.

---

## D-009 · AI transparency
**Date:** 2026-06-19
**Status:** ✅ Accepted
**Decision:** Every AI-touched piece of content carries a visible `AI contribution: X` score (0–1) and the name of the human reviewer.
**Why:** Teachers must trust this product. Trust comes from transparency, not from hiding the AI.

---

## Decision template (copy this for new decisions)

```markdown
## D-XXX · <short title>
**Date:** YYYY-MM-DD
**Status:** ⏳ Proposed | ✅ Accepted | ❌ Rejected | 🔁 Superseded by D-YYY
**Decision:** <one sentence>

**Why:**
- <reason 1>
- <reason 2>

**Alternatives considered:**
- <X> — why not

**Reversal cost:** <low | medium | high | irreversible>
```
