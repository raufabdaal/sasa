# Data & Ingestion Architecture
### How a NCDC circular becomes a teacher's 7-minute brief

---

## The fundamental constraint

**NCDC and UNEB do not publish a machine-readable API.** They publish:
- PDFs on their websites (`ncdc.go.ug`, `uneb.ac.ug`)
- DOCX circulars emailed to head teachers
- YouTube videos of retooling sessions
- WhatsApp broadcasts to district inspectors
- Hard-copy booklets handed out at regional orientations

Our ingestion architecture must treat this messy, multi-channel reality as the source of truth.

---

## The 4-Phase Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PHASE 4: OFFICIAL PARTNERSHIP                    │
│   NCDC editorial team publishes directly into Sasa via our API      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ depends on (year 2)
┌────────────────────────────────┴────────────────────────────────────┐
│                  PHASE 3: ACTIVE SCRAPING + WATCHERS                │
│   Scheduled scrapes of NCDC/UNEB sites + YouTube transcripts        │
│   Hash-based change detection → triggers extraction pipeline        │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ depends on
┌────────────────────────────────┴────────────────────────────────────┐
│              PHASE 2: ADMIN UPLOAD + AI EXTRACTION                  │
│   Editor uploads PDF/DOCX → LLM extracts structured update          │
│   Human reviews → publishes to feed                                 │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ depends on
┌────────────────────────────────┴────────────────────────────────────┐
│                    PHASE 1: SEEDED MOCK DATA                        │
│   25 hand-crafted updates as MDX files in repo                      │
│   Lets us ship investor demo + onboard first teachers in weeks      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## The Universal Schema — `CurriculumUpdate`

Every update, regardless of source, normalizes to this shape:

```typescript
type CurriculumUpdate = {
  id: string;                          // ulid
  slug: string;                        // url-friendly
  title: string;                       // human-readable
  summary: string;                     // one sentence, < 140 chars
  body_mdx: string;                    // full Brief content

  // Taxonomy
  level: 'O-Level' | 'A-Level' | 'Primary';
  subjects: Subject[];                 // ['Biology', 'Chemistry']
  grades: Grade[];                     // ['S1', 'S2', 'S3', 'S4']
  constructs: Construct[];             // ['Knowledge', 'Skill', 'Application', 'Values']
  topics: string[];                    // free tags

  // Change semantics — the heart of the product
  change_type: 'addition' | 'removal' | 'revision' | 'clarification' | 'assessment';
  diff: {
    before: string | null;             // markdown
    after: string;                     // markdown
    rationale: string;                 // why NCDC changed it
  };

  // Source provenance — never lose this
  source: {
    publisher: 'NCDC' | 'UNEB' | 'MoES';
    doc_title: string;
    doc_url: string | null;
    doc_hash: string | null;           // sha256 of original PDF
    issued_date: string;               // ISO
    ingested_via: 'manual' | 'admin_upload' | 'scrape' | 'partner_api';
  };

  // Effectivity
  effective_date: string;              // when teachers must use this
  expires_date: string | null;         // for transitional rules

  // The Brief
  estimated_read_minutes: number;      // target: 7
  audio_url: string | null;            // pre-rendered TTS
  audio_voice: 'narrator_en_ug' | 'narrator_lg' | 'narrator_run' | null;

  // The Sandbox
  sandbox_exercises: SandboxExercise[];

  // Publishing
  status: 'draft' | 'in_review' | 'published' | 'archived';
  published_at: string | null;
  authors: User[];                     // human editors
  ai_contribution: number;             // 0–1, transparency metric
};

type SandboxExercise = {
  id: string;
  type: 'regrade' | 'rewrite' | 'plan_opener' | 'design_aoi' | 'identify_construct';
  prompt_mdx: string;
  reference_material: string;          // e.g. a sample student response
  rubric: ConstructRubric;             // for AI grader
  estimated_minutes: number;
};

type ConstructRubric = {
  knowledge: { weight: number; descriptor: string };
  skill:     { weight: number; descriptor: string };
  application: { weight: number; descriptor: string };
  values:    { weight: number; descriptor: string };
};
```

---

## Phase 1 — Seeded Mock Data (Weeks 1–2)

**Goal:** Have a fully populated app for investor demos and first 50 teachers.

**Source content (realistic, not real):** 25 updates modelled on actual 2024–2026 NCDC/UNEB activity:
- New A-Level grading system (A–E, construct-based) — March 2026
- O-Level Chemistry construct weight revision — June 2026
- Kiswahili Activities of Integration sample bank — April 2026
- ICT practical assessment guidelines update — Feb 2026
- History & Political Education topic merge (colonial → liberation arc)
- ... 20 more

**Storage:** `/content/updates/*.mdx` with frontmatter matching the schema.

**Build:** Next.js MDX loader → static generation at build time. Zero DB needed for v0.

---

## Phase 2 — Admin Upload + AI Extraction (Weeks 6+)

**Trigger:** Editor (us) gets a new NCDC circular via WhatsApp / email / scrape.

**Flow:**
```
Editor uploads PDF/DOCX
        │
        ▼
[Document Service]
   - parse with unstructured.io
   - extract text + tables + figures
   - sha256 hash → dedupe
        │
        ▼
[Extraction Pipeline — Claude Sonnet]
   Prompt 1: Classify (level, subjects, grades, constructs, change_type)
   Prompt 2: Diff against prior version of same syllabus section
              (retrieved via pgvector similarity on subject+topic)
   Prompt 3: Draft 7-min Brief in Sasa house voice
              (using few-shot examples from already-published Briefs)
   Prompt 4: Generate 3 Sandbox exercises matching change_type
        │
        ▼
[Human Review Console]
   - Side-by-side: original PDF | extracted Update
   - Edit, approve, schedule publish
        │
        ▼
[Published to Feed]
   - Trigger TTS for audio
   - Push WhatsApp + in-app notif to subscribed teachers
```

**Cost estimate (per update):** ~$0.40 in LLM + $0.10 in TTS. Editor time: ~25 min.
**Target throughput:** 5 updates/week in month 3, 20/week by month 6.

---

## Phase 3 — Active Scraping (Month 4+)

**Watchers:**
- `ncdc.go.ug/publications` — nightly cron, diff HTML, capture new PDFs
- `uneb.ac.ug/circulars` — nightly cron
- NCDC YouTube channel — RSS poll, transcribe new videos with Whisper, treat transcript as source doc
- A curated list of district education officer WhatsApp groups (with consent + via a teacher-partner) — manual forward to a dedicated email inbox → into the pipeline

**Hash-based dedupe** prevents reprocessing. New documents flow into Phase 2's extraction pipeline automatically.

**Legal:** Scrape only publicly-published documents. Always cite source + link to original. Never republish exam papers in full.

---

## Phase 4 — Partnership (Year 2)

The endgame. Once we've proven distribution to NCDC/UNEB:
- We become their **official digital retooling channel**
- They publish to our API directly
- We co-brand the Retooling Passport
- They get analytics ("78% of Mukono Biology teachers completed the June update within 7 days")

This is the moat. Once we are inside, no competitor can catch up.

---

## What lives where

| Data | Storage | Why |
|---|---|---|
| Published `CurriculumUpdate` | Postgres (Neon) + MDX in object storage | Queryable + version-able |
| Original source docs (PDF/DOCX) | Cloudflare R2 | Cheap, provenance |
| Audio files | Cloudflare R2 + CDN | Edge delivery |
| Teacher progress (`UserUpdate`) | Postgres | Per-user state |
| Vector embeddings (for diffing) | pgvector in same Postgres | One DB to operate |
| Editor drafts | Postgres + soft-delete | Audit trail |

---

## Observability

Every update carries `ai_contribution: 0..1` — a transparency metric we surface in the UI: *"This brief was drafted by AI from the official NCDC circular and reviewed by [Editor name]. AI contribution: 0.7."*

We never hide the AI. Teachers trust us because we tell them exactly what touched the content.
