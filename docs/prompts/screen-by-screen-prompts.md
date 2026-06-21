# Screen-by-Screen Prompts
### For tools like v0, Lovable, or Cursor where you build screen-at-a-time

Each prompt below is self-contained. Paste one at a time.

---

## PROMPT 1 — The Landing Page (for investors / first schools)

> Build a single-page marketing site for **Sasa**, an EduTech platform for Ugandan secondary school teachers adapting to the new Competency-Based Curriculum.
>
> Tone: quiet, sophisticated, Apple-restraint. Warm off-white background (`#FAF8F4`), ink-black text (`#1A1A1A`), one accent color used sparingly. Type system: Inter for UI, Newsreader (serif) for headlines and quotes. Generous whitespace. **No stock photos. No illustrations. No African-themed decorations.**
>
> Sections, in order:
> 1. **Hero** — Single sentence in 64px serif: *"The curriculum changed. We help teachers catch up."* Below it, a thin liquid-glass bar with one CTA: *Request access*. Top right: tiny wordmark "Sasa".
> 2. **The Problem** — Three short paragraphs, set in 18px serif at max 68ch, left-aligned. Each paragraph is its own block with 120px vertical space between. Topics: (a) cascade training failed, (b) NCDC keeps updating, (c) teachers carry the blame.
> 3. **The Product** — Four pillars (Feed / Brief / Sandbox / Ledger) as four large flat cards in a 2x2 grid on desktop, stacked on mobile. Each card: a single Lucide icon (1.25px stroke), a name, two sentences. No drop shadows. 1px hairline border in `rgba(0,0,0,0.08)`.
> 4. **A quiet quote** — Pull-quote from a real teacher (fictional but plausible), set in 28px serif italic, centered, max 60ch.
> 5. **Footer** — Single line: "Sasa is built in Kampala. For Ugandan teachers." + small links.
>
> Motion: every element fades up 8px with a soft spring as it enters viewport. Once only.
>
> Use Next.js 15 + Tailwind v4 + Framer Motion. No images. No icons except Lucide.

---

## PROMPT 2 — The Feed (home screen)

> Build the **Feed** screen for Sasa, an authenticated home for a Ugandan secondary school teacher.
>
> Layout (mobile-first):
> - Top: a thin **liquid-glass top bar** (`backdrop-filter: blur(24px) saturate(140%)`, background `rgba(250,248,244,0.72)`, 0.5px border in `rgba(0,0,0,0.06)`) containing on left: time-aware greeting *"Wasuze otya, Nakato."* (small, 14px, weight 500); on right: a small avatar circle.
> - Below: a chronological list of cards. Each card is full-width on mobile, padded `24px`, separated by 1px hairlines (not gaps — feels like a newspaper).
>
> Card structure:
> ```
> [SUBJECT pill, monospace 11px, uppercase, letter-spaced]   [• new dot]
> [Title, serif Newsreader, 22px, leading 1.25, weight 500]
> [Summary, sans Inter, 15px, color --ink-2, max 2 lines]
> [Meta row: "5 min read · NCDC · June 2026", 12px, color --ink-3]
> ```
>
> Tap target = entire card. On press: subtle 0.98 scale spring. On release: route transition where the card title visually scales into the next screen's header (shared element).
>
> Bottom: a **liquid-glass tab bar** with 4 tabs (Feed, Sandbox, Ledger, Me). Active tab is filled ink, inactive is `--ink-3`. Icons are Lucide 1.25px stroke. Labels 11px below.
>
> Empty state (no updates): centered serif italic line *"Nothing new this term. Rest a little."*
>
> Use Next.js 15 App Router (RSC for the list), Framer Motion for transitions. Fonts via next/font (Inter + Newsreader). Mock data: an array of 8 updates with varied subjects (Biology, Chemistry, Kiswahili, ICT, History).

---

## PROMPT 3 — The Brief (reading view)

> Build the **Brief** reading view for Sasa. This is what opens when a teacher taps a card from the Feed.
>
> Layout:
> - **Top bar (liquid glass, sticky):** Back arrow on left, the current section name in 13px monospace uppercase center (updates as user scrolls: "CONTEXT" → "THE CHANGE" → "WHY" → "CLASSROOM EXAMPLE" → "COMMON PITFALL"), audio play button and bookmark icon on right.
> - **Hero block:** 64px top padding. Subject pill (monospace 11px). Below: title in Newsreader serif 32px weight 500, max 28ch. Below: meta row — "Effective July 2026 · NCDC Circular 2026/03 · 7 min read" in 12px `--ink-3`.
> - **Body:** MDX content rendered at body size 18px Newsreader serif, line-height 1.6, max 68ch, generous 32px vertical rhythm between paragraphs. Section headers in 13px monospace uppercase with `--ink-3`, preceded by a 24px gap and a 1px hairline above.
> - **Custom MDX components:**
>   - `<Diff before="..." after="...">` — renders a two-column box (stacked on mobile): red-strikethrough on left, green-additions on right, both in JetBrains Mono 14px, in a card with `--paper-2` background and 12px radius.
>   - `<Construct k="B" s="A" a="C" v="B" />` — renders the 2x2 grid of constructs with letter grades.
>   - `<Pitfall>...</Pitfall>` — a softly-bordered callout with a tiny Lucide AlertCircle icon, body text in italic serif.
> - **Footer block:** Large CTA button — full width, dark ink background, 56px tall, label *"Try it in the Sandbox →"* — 80px above the bottom edge. Below the CTA, in 11px `--ink-3`: *"Drafted by AI from the official NCDC circular. Reviewed by Aisha Namaganda. AI contribution: 0.7."*
> - **Reading progress:** a 1px line at the very top of the viewport, color `--ink`, width = % scrolled. Almost invisible.
>
> Motion:
> - On mount, the title slides up 12px with a 380/32/0.9 spring.
> - Diff blocks animate their content in once when scrolled into view: strikethrough first (200ms), then green addition (200ms after).
> - Audio player: a thin pill 280px wide centered at bottom 24px when active, glass surface, contains play/pause + a progress bar.
>
> Use Next.js 15, MDX (next-mdx-remote), Framer Motion. Use the Sasa color tokens from the design system.

---

## PROMPT 4 — The Sandbox (re-grade exercise)

> Build the **Sandbox** screen for Sasa — specifically the "re-grade" exercise type.
>
> Context: at the end of a Brief about the new construct weights in O-Level Chemistry (30/30/40), the teacher is shown a real-style student response to an Activity of Integration and asked to grade it using the new rubric. AI then gives feedback.
>
> Layout (stacked on mobile, side-by-side on tablet ≥ 1024px):
> - **Top bar (glass):** Back arrow, label "Exercise 1 of 3", a thin segmented progress bar (3 segments, current filled).
> - **Left/top: the reference material**
>   - Heading "S3 Student response" in 13px monospace `--ink-3`
>   - The student's response in a `--paper-2` surface card, padded 24px, body in serif italic 16px (to feel like a quoted passage, not editable text)
>   - Below: "Question they were answering" — collapsible accordion, closed by default
> - **Right/bottom: the grading panel**
>   - Heading: "Grade using the NEW construct weights (30/30/40)"
>   - Four rows, one per construct (Knowledge / Skill / Application / Values). Each row:
>     - Construct name on left (15px, weight 500)
>     - Weight in parens (12px, mono, `--ink-3`)
>     - On right: a segmented 5-button selector A B C D E. Each button is 36px square, hairline border, no fill until tapped. On tap: ink fill, paper text. Spring scale 0.95 then back.
>   - Below: a textarea labeled "Your reasoning (optional)" — 4 rows, ghost border, no shadow.
>   - Submit button: full-width, ink, 52px tall, label "Submit grade".
>
> On submit:
> - Button collapses into a small spinner-less progress bar (or skeleton) at top of feedback area
> - Within ~2s, **feedback appears inline** below the grading panel (not in a modal):
>   - A single ✓ glyph (12px) followed by one of three calm prose responses depending on alignment with the rubric.
>   - Feedback **must cite the construct descriptor first** ("NCDC says: '...'") then comment on the teacher's grade.
>   - Feedback **never uses the words "wrong" or "incorrect."**
> - After feedback: a "Next exercise →" link in ink, 15px weight 500.
>
> Wire the submit to `/api/sandbox/grade` which calls Claude Sonnet with the rubric, the student response, and the teacher's grades. The system prompt for the AI is below — use it exactly:
>
> ```
> You are a senior NCDC curriculum specialist reviewing a Ugandan secondary school teacher's grading of a student response.
>
> Your job is to:
> 1. ALWAYS cite the relevant official construct descriptor first, in quotes.
> 2. Compare the teacher's grade to what the descriptor implies — gently.
> 3. Speak as a respected colleague, not a judge.
> 4. Never use the words "wrong", "incorrect", or "mistake".
> 5. Maximum 4 sentences.
> 6. End with a single concrete nuance the teacher could consider.
> ```
>
> Use Next.js 15 (server action for the AI call), Tailwind v4, shadcn for the textarea (restyled hard), Framer Motion.

---

## PROMPT 5 — The Ledger + Retooling Passport PDF

> Build the **Ledger** screen for Sasa, plus the PDF export route.
>
> Ledger screen layout:
> - Top bar (glass): label "Ledger" centered, 15px weight 500. On right: tiny "Export" link in 13px ink.
> - Hero block: the teacher's name in Newsreader serif 28px. Below: school name in 14px `--ink-3`. Below: the **streak dot** — a single 12px ink circle with N rings around it (one ring per consecutive week of activity). Animated subtly: rings rotate at 0.05 rev/sec almost imperceptibly. Below the dot: "47 weeks current" in 12px mono `--ink-3`.
> - List of completed updates. One row per update:
>   ```
>   [date in mono 12px --ink-3]   [title in serif 17px]
>                                 [subject pill mono 11px] [alignment score 12px mono]
>   ```
>   Rows separated by hairlines (no gaps).
> - Group by month with a 13px mono uppercase label `JUNE 2026` etc.
>
> Tap on a row → opens that Brief in read-only mode (already completed).
>
> PDF export route at `/ledger/export`:
> - Use `@react-pdf/renderer`
> - Format: A4 portrait, 36mm side margins, 32mm top/bottom
> - Heading: "RETOOLING PASSPORT" in serif caps, 18pt, letter-spaced 0.2em, brass color `#7A6233`
> - 1px brass rule below
> - Teacher's name in serif 32pt, weight 500
> - School + district in 11pt sans `--ink-2`
> - A 6pt brass rule (the "seal" placeholder — leave a 30mm circle on top right blank for the future official seal)
> - Summary stats: "47 curriculum updates internalized · Average alignment: 84% · Streak: 47 weeks"
> - Then a table:
>   | Date | Subject | Title | Alignment |
>   |---|---|---|---|
>   - Date in mono 9pt, subject mono 9pt, title serif 11pt, alignment mono 9pt right-aligned
>   - Hairline rules between rows, no fills
> - Footer: "Issued by Sasa · sasa.ug · " + ISO date. Small mono 8pt centered.
>
> The PDF must feel like a university transcript — quiet, undeniable, framed-on-a-wall worthy.
>
> Mock data: 12 completed updates spanning Biology, Chemistry, Kiswahili, ICT, History.

---

## PROMPT 6 — Admin Ingest Console (the backstage)

> Build the **Admin Ingest Console** for Sasa — used by our editorial team to turn a raw NCDC PDF into a published Brief.
>
> This is internal — desktop-only is fine. But still apply the Sasa design system. Editors deserve craft too.
>
> Layout: a 3-column workspace.
> 1. **Left (320px):** queue of uploaded documents. Each item: filename, upload date, status badge (pending / extracted / in review / published).
> 2. **Center (flex):** the currently-selected document. Split vertically:
>    - Top half: PDF viewer (use `react-pdf`)
>    - Bottom half: tabs — "Extracted JSON" | "Draft Brief" | "Generated Exercises"
> 3. **Right (380px):** the structured `CurriculumUpdate` form. Editable fields for every schema column. At the bottom: "Run extraction" button (triggers Claude pipeline), "Save draft", "Send to review", "Publish" (gated by review status).
>
> The extraction button calls a server action that:
> 1. Uploads PDF text to Claude Sonnet
> 2. Returns a draft `CurriculumUpdate` with title, summary, taxonomy, diff, body_mdx, and 3 sandbox exercises
> 3. Pre-fills the right column
> 4. Shows AI contribution score
>
> Editorial commands available via keyboard:
> - `Cmd+K` — command palette
> - `Cmd+Enter` — save draft
> - `Cmd+Shift+P` — publish
>
> Visually: this is the **only** place we allow slightly more density. Glass tab bar at top, paper background, monospace metadata everywhere, ink accents. No color. Feels like Linear.

---

## PROMPT 7 — Onboarding (4 screens)

> Build the **onboarding** for Sasa — a new teacher's first 2 minutes.
>
> 4 full-screen steps, transitioning horizontally with a 280ms spring. **No progress bar** (it implies burden).
>
> Each screen has the same layout:
> - Top: a small back arrow (only after step 1)
> - Centered vertically: a single question in Newsreader serif 32px weight 500, max 22ch, left-aligned
> - Below: the input(s) for that question
> - Bottom right: a single ink button "Continue" (or final "Begin") — 48px tall, 16px padding-x
>
> The 4 questions:
> 1. **What do you teach?**
>    - First a segmented control: O-Level | A-Level | Primary
>    - Below: a chip-style multi-select of subjects (filtered by chosen level). Max 4 selectable. Selected chips fill ink. Unselected are hairline-bordered.
>    - Below that: a chip-style multi-select of grades (S1–S6 or P1–P7).
> 2. **Where do you teach?**
>    - Typeahead for school name (pre-populate dropdown with mock list of 20 Ugandan secondary schools — Kings College Budo, Gayaza High, Ntare School, etc.)
>    - District auto-fills below.
> 3. **How should we greet you?**
>    - First name input (single line, ghost border, 24px serif)
>    - Preferred greeting language: chips for English / Luganda / Runyankole / Luo / Ateso
> 4. **You're 6 updates behind. Want to catch up?**
>    - The line above as the question
>    - Two buttons stacked: "Show me what's new" (ink fill) and "I'll browse" (ghost)
>    - On tap, fade to Feed.
>
> Use Next.js 15, Framer Motion. Persist answers to local state then call a server action on final step that creates the user record.

---

> **End of screen-by-screen prompts.**
