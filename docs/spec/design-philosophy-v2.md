# Sasa — Design Philosophy v2
### "A really well-made notebook, not a museum."

> **Supersedes:** `design-philosophy.md` (v1 — "quiet sophistication")
> **Date:** 2026-06-20
> **Why we changed:** v1 prioritized elegance to the point of starvation. The result felt cold, hard to navigate, and didn't serve the actual user (a Ugandan teacher who needs clarity and warmth, not a museum hush). Functionality was being sacrificed for restraint.

---

## The fundamental rule (founder's words, paraphrased)

> "We don't want design to affect what we are actually providing. We don't want to strip off things because of design. The most important thing is the functionality. Design is just complementary. If you see that design is going to bring some confusion, change it, make an alternative, but also keep track."

**Operationalized as three commandments:**

### 1. Function defeats form, every time.
If a "beautiful" design element makes the next action unclear, kill it. No empty state without an action. No screen without an obvious next step. No icon-only button without a label if the label aids comprehension.

### 2. Warmth over restraint.
We are building for a Ugandan teacher in a staffroom, not an art collector in a SoHo loft. The app should feel like the most thoughtful tool on their phone, not the most precious one. Warm cream, friendly serif, peach/apricot accents, real shadows. Approachable, never precious.

### 3. Track every deviation.
Every time we change a design decision from a previous spec, it goes in `docs/spec/DESIGN_DEVIATIONS.md` with date + reason. Future-us needs to know *why* we changed our mind.

---

## The new visual language

### Color
A warmer foundation. Color used for **identification and personality**, not decoration.

```css
:root {
  /* Foundation — warm and inviting, not gallery-cold */
  --cream:       #F7F2E8;   /* primary background, warmer than v1 */
  --cream-2:     #EEE7D7;   /* card surface */
  --cream-3:     #E3DAC3;   /* subtle dividers/wells */
  --paper:       #FFFCF6;   /* the brightest surface (Passport, focused content) */

  /* Ink — text */
  --ink:         #1F1B16;   /* primary text, slightly warmer than pure black */
  --ink-2:       #5C544A;   /* secondary text */
  --ink-3:       #968D7E;   /* tertiary text */

  /* Accents — used purposefully */
  --peach:       #E8A87C;   /* primary CTA fill, "do this now" energy */
  --peach-soft:  #F6D9C2;   /* CTA hover/secondary, highlighted quote background */
  --clay:        #B85C38;   /* used sparingly for important moments (streak milestone, etc.) */
  --sage:        #7A8B6F;   /* "done" / "completed" state */
  --sage-soft:   #D4DCC8;
  --highlight:   #F4D35E;   /* the highlighted-quote yellow, like a real highlighter */

  /* Subject color-coding — gentle, never loud */
  --subj-chem:   #7A8B6F;   /* sage */
  --subj-bio:    #6B8E7F;   /* deeper sage-teal */
  --subj-kis:    #E8A87C;   /* peach */
  --subj-ict:    #8FA5B8;   /* soft blue */
  --subj-hist:   #B85C38;   /* clay */
  --subj-math:   #9B8AB8;   /* lavender */
  --subj-eng:    #C9A55C;   /* warm gold */
  --subj-all:    #5C544A;   /* generic ink-2 for cross-subject */

  /* Lines */
  --line:        rgba(31, 27, 22, 0.08);
  --line-2:      rgba(31, 27, 22, 0.04);
}
```

### Typography
- **Headlines (serif):** `Fraunces` or `Source Serif 4` — the friendly, slightly playful serif from the "My Library" reference. **Bigger and more confident than v1.** A Brief title should be 28–32px, not whispered.
- **Body reading (serif):** Same family, lighter weight, comfortable 17–18px.
- **UI (sans):** `Inter` — clean, professional, no nonsense.
- **Mono (rare):** `JetBrains Mono` — only for technical metadata (dates, scores, diff blocks).
- **No tiny mono-uppercase eyebrows everywhere.** v1 over-used them and made the app feel like a CLI tool. Use them only where genuinely useful (section labels in long-form Brief content).

### Buttons — the biggest change from v1

| Type | v1 (hairline + tiny) | v2 (confident + tactile) |
|---|---|---|
| **Primary action** | Hairline outlined pill, easy to miss | **Solid peach fill, 48px tall, rounded-2xl, clear label, optional icon.** Drop subtle shadow. |
| **Secondary** | Plain text link | **Cream-2 fill with ink text, same size as primary** |
| **Tertiary / link** | — | Underlined ink text inline |
| **Destructive** | — | Subtle clay text/border, never solid red |

A button must be **obviously a button**. If a teacher has to wonder "is this tappable?" we've failed.

### Cards
v1 used hairline-separated list rows. v2 uses **actual cards** with:
- Cream-2 background or white-ish paper
- Rounded-2xl corners (16px)
- Soft shadow (`0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)`)
- 18–22px padding
- Always tappable with a clear visual hover/active state

### Subject color-coding
Every Brief / Sandbox / Ledger row has a **subject color** — a small colored dot or strip next to the title, plus a soft tint on its chip. This makes the Feed visually scannable. A teacher who teaches Chemistry can spot Chemistry updates immediately by the sage-green dot. Color is meaningful, not decorative.

### Highlighted quotes inside Briefs
Pull-out key sentences with a **soft peach background** (or yellow highlight) and a slightly larger serif. Like a real highlighter on a page. (See the "Wealth Equation" reference image.) Makes the most important sentence in each Brief impossible to miss.

### Liquid glass — keep, but tone down
The glass effect for the top/bottom bars stays. It's the one "premium" touch that works. But the bars now have **clearer visual weight** — a tiny bit more opacity, slightly thicker border.

---

## What we kill from v1

| v1 element | Why it goes | Replaced with |
|---|---|---|
| Tiny mono-uppercase "eyebrow" labels on every card | Felt clinical, like reading a CLI | Cards have a colored subject dot + normal-case title |
| Hairline buttons | Hard to see, looked like text | Solid filled buttons |
| Pure white-on-paper diff blocks | Looked like a code-review tool, alienating | Side-by-side cards with sage "after" / faded "before" + plain text |
| No empty-state actions | Dead ends | Every empty state has a suggested next step |
| `--accent-feed/brief/sandbox/ledger` rotating accent (never even applied) | Confusing, hard to remember | Subject-based color-coding, applied everywhere |
| "If you know you know" Saturn streak rings | Cool idea but invisible to first-time users | Visible streak indicator + plain-language counter ("47 weeks. Keep going.") |
| The forbidden "do not say wrong" rule applied to AI feedback | Keep this — it's actually good | (unchanged) |
| "Confetti is forbidden" | Keep — but allow **tasteful** completion moments | A check mark + a peach pulse, no confetti |

---

## What we keep from v1

- **Citation-first AI feedback** (cite the NCDC descriptor before judging)
- **AI transparency** (show `AI contribution: 0.7`, name the reviewer)
- **No stock photos of African children, no flags, no kente**
- **Audio narrator is real and Ugandan-voiced** (when we get there)
- **The Retooling Passport** as a serif-typeset PDF (universally agreed on as a "wow" moment)
- **Offline-first PWA** mindset
- **Mobile-first**
- **Time-aware greeting** in local language

---

## The new test (replaces the "Budo staffroom" test)

> *Would Teacher Nakato, after a tiring day, open this app and feel like she's holding something useful and dignified — like a really good notebook from a Kampala stationery shop, not a ceremonial object?*

If yes → ship.
If it feels like either a children's app *or* a museum → fix it.

---

## Hierarchy of importance (when in doubt, prioritize higher)

1. **The teacher knows what to do next** at every moment
2. **The teacher can read the content comfortably** (serif body, 17–18px, generous line height)
3. **The teacher can tell two things apart at a glance** (subject color, clear card boundaries)
4. **The teacher feels respected** (no condescension, no over-explanation)
5. **The teacher might enjoy looking at it** (the design moments — but never at the cost of 1–4)
