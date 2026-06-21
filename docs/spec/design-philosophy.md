# Sasa — Design Philosophy
### "Quiet sophistication. The work shows itself only to those who look."

> ⚠️ **SUPERSEDED ON 2026-06-20 BY `design-philosophy-v2.md`.**
> This document reflects the original "Apple restraint" direction that proved too cold and museum-like in practice for the actual user (a Ugandan teacher). It's kept here for historical context. See `DESIGN_DEVIATIONS.md` (DEV-001 through DEV-005) for what changed and why.

---

## The North Star

We are designing for a **Ugandan secondary school teacher** who has been told, implicitly and often explicitly, that they are *the problem* with the new curriculum. Every pixel of Sasa must communicate the opposite: **you are a professional, this tool was made for you, the work is serious.**

That is the brief. Everything below serves it.

---

## Three Principles

### 1. Restraint is Respect
Most EdTech for African markets is loud — bright primaries, cartoon mascots, gamification badges, "Congratulations 🎉" modals. It is condescending. Sasa does the opposite. We use whitespace the way a luxury watchmaker uses negative space on a dial: as a statement that the few things present are the only things that matter.

### 2. The Surprise is in the Substrate
The user should never look at Sasa and say *"wow, that's flashy."* They should use Sasa for two weeks and slowly notice — the spring on a card dismiss is exactly right; the audio narrator pronounces *"Nakawa"* correctly; the export PDF has the school's motto in the footer; the typography pairing is from a Swiss design school but it doesn't shout about it.

This is the **"if you know, you know"** layer. It is the difference between Apple Notes and Notion. Both work. One feels inevitable.

### 3. The Content is the Hero
Curriculum text, sample student work, construct descriptors — these are what the teacher came for. Chrome (navigation, chrome, decoration) recedes. We use **liquid glass surfaces** (subtle backdrop-filter blur, low-opacity strokes) so chrome floats *over* content without competing with it. Content has the sharp edges; chrome has the soft ones.

---

## Visual Language

### Color
A **warm off-white** base (`#FAF8F4` — paper, not gallery white). A single deep accent that *rotates by section* — this is one of the "if you know" details:

| Section | Accent | Metaphor |
|---|---|---|
| Feed | `#1A1A1A` (Ink) | The morning newspaper |
| Brief | `#2B2118` (Bound book) | A well-bound textbook |
| Sandbox | `#8B4A2B` (Clay) | The hands-on workshop |
| Ledger | `#7A6233` (Brass) | The brass plate on a teacher's door |

No section ever uses more than **one** accent + ink + paper. Three-color maximum on any screen.

Dark mode is **not** an inversion. It is a separate composition — `#0E0C0A` base, accents lift to warmer tones. We design it in parallel, not as an afterthought.

### Typography
- **UI:** Inter (variable). Tight tracking. Weights 400, 500, 600 only.
- **Reading (Brief body):** Newsreader or Source Serif 4. 18px, 1.6 line-height, max 68ch.
- **Mono accents (Ledger metadata, code-like elements):** JetBrains Mono, 13px, used sparingly.
- **No display fonts.** No script. No Google-Fonts-trendy choice. Trust the hierarchy.

Type does ~70% of the visual work. If we removed all color and all borders, the hierarchy must still hold.

### Liquid Glass — used carefully
Surfaces that float (top nav, the audio player, modal sheets, the Sandbox toolbar) use:
```css
background: rgba(250, 248, 244, 0.72);
backdrop-filter: blur(24px) saturate(140%);
border: 0.5px solid rgba(0, 0, 0, 0.06);
box-shadow:
  inset 0 0.5px 0 rgba(255,255,255,0.6),
  0 1px 2px rgba(0,0,0,0.04),
  0 8px 24px rgba(0,0,0,0.06);
```
Static surfaces (the Brief body, the Ledger list) are flat paper. Glass only where things *move*.

### Motion
- Springs, not eases. Default: `stiffness 380, damping 32, mass 0.9`.
- Every transition has one of three jobs: **spatial continuity** (where did this come from?), **state change** (what just happened?), **attention** (look here, briefly).
- Nothing animates longer than 400ms. Nothing repeats. No "subtle hover bounces."
- The one indulgence: when a Brief is added to the Ledger, the card *physically falls* into the Ledger tab with a soft spring. It happens once. The user remembers it forever.

### Iconography
**Lucide**, stripped to 1.25px stroke. Custom-drawn for three icons only: the Sasa mark, the Construct glyph, the Retooling Passport seal.

### Illustration
None. Zero. No spot illustrations, no empty-state cartoons. Empty states are a single sentence in serif italic, centered, with one action.

---

## The "If You Know, You Know" Details

These are the small bets. The user won't list them. They will just *trust* the product.

1. **Construct grades render as a 4-cell mini-grid** (Knowledge / Skill / Application / Values) — same shape on every screen. The teacher learns the shape, then the shape becomes a language.
2. **The audio narrator** is a Ugandan voice (not American TTS), with correct stress on local words. We will hand-record the most common 200 terms.
3. **The Ledger PDF export** is typeset like a university transcript — name in serif caps, school crest space, gold-foil-style accent. It is meant to be printed and framed.
4. **The streak indicator is a single dot** that gets one ring per consecutive week. After a year it looks like Saturn. Nobody mentions it. Some teachers screenshot it.
5. **Time-of-day awareness** — at 6 AM the app greets *"Wasuze otya"* (Luganda morning). At 6 PM, just *"Good evening, Nakato."* No more than that. Restraint.
6. **The "before & after" diff** uses the same visual language as `git diff` — red strike-through, green addition, monospace. Teachers feel the precision of it. Engineers built this for them.
7. **The Sandbox grading feedback** never says "wrong." It says *"The official construct descriptor reads X. Your response was Y. Here is the gap."* Citation first, judgment never.
8. **Loading states are skeleton-only, never spinners.** Spinners on 3G feel like failure. Skeletons feel like the content is already on its way.
9. **The 404 page** is a single line: *"That page is not in this term's syllabus."* in italic serif. Centered.
10. **The settings page has 9 items, not 90.** If a setting is needed by < 5% of teachers, it doesn't exist.

---

## What We Will Never Do
- Confetti, badges, points, leaderboards
- Gradients longer than 2 stops, or that span more than 30% of a screen
- Stock photos of African children
- The word "engagement" anywhere in the UI
- Pop-up tutorials, coach marks, onboarding carousels longer than 3 cards
- Sound effects (audio narration is content, not chrome)
- "AI sparkle" icons. The AI is a colleague, not a magic trick.

---

## The Test
Before any screen ships, it must pass this question:

> *Would a senior teacher at King's College Budo be embarrassed to have this open on her phone in the staffroom?*

If the answer is no — even a flicker of no — we ship it.
