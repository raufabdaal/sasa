# Design Deviations Log

> **The founder's rule:** *"If you see that design is going to bring some confusion, change it, make an alternative, but also keep track."*

This file is that track record. Every time we override a previous design decision, it gets logged here with:
- **When** we changed it
- **What** we changed
- **Why** (the user-facing problem it caused)
- **What we did instead**

Append-only. Never edit historical entries.

---

## DEV-001 · 2026-06-20 · Color palette: cold beige → warm cream + peach

**Previous decision (v1, design-philosophy.md):**
Apple-inspired restraint. `#FAF8F4` paper, near-black ink, no accent colors at all. Section-rotating accents (`--accent-feed`, etc.) defined but never applied. The aesthetic was "quiet sophistication."

**Problem reported:**
> "It is a bit maybe too soulless… missing some element, some element of color. I don't think it cooperates with the ideology of the consumer who is going to be the teacher. We went too far with the elegant luxury field."

**New decision (v2, design-philosophy-v2.md):**
Warmer cream foundation (`#F7F2E8`), introduce a peach/apricot primary CTA color (`#E8A87C`), introduce subject color-coding (sage for Chemistry, peach for Kiswahili, soft blue for ICT, clay for History, etc.), highlight yellow for pull-quotes inside Briefs.

**Reasoning:**
A Ugandan secondary school teacher is not a museum-goer. They want a tool that feels approachable and warm, like a really well-made notebook. Color does meaningful work: subject identification (Chem at a glance), action priority (peach buttons say "do this now"), completion state (sage = done).

**Tracked across:**
- `app/src/app/globals.css` — new tokens
- `preview.html` — visual refresh
- Subject pills, CTA buttons, highlighted quotes all updated

---

## DEV-002 · 2026-06-20 · Buttons: hairline-pill → solid filled

**Previous decision (v1):**
Buttons were thin black borders ("hairline pills") with ink text on cream background. The aesthetic intention was restraint and elegance.

**Problem reported:**
The user couldn't immediately tell where to tap. The "Try it in the Sandbox" CTA was buried. The Sandbox grade-submit buttons looked decorative rather than functional.

**New decision (v2):**
Primary CTAs use **solid peach fill (#E8A87C) with ink text**, 48px tall, rounded-2xl, with a subtle shadow. Secondary buttons use cream-2 fill. Tertiary uses underlined inline text.

**Reasoning:**
A button must be unmistakably a button. The teacher should never have to wonder "is this tappable?" Functional clarity > aesthetic minimalism.

---

## DEV-003 · 2026-06-20 · Empty states: dead-end → actionable

**Previous decision (v1):**
Empty states were a single serif-italic sentence (*"Open a Brief and tap Try it in the Sandbox."*) — meant to feel restrained and respectful.

**Problem reported:**
> "When you open up the feed, you open up with one of the things, but it doesn't take you anywhere. The Sandbox wants you to open something."

The empty Sandbox/Ledger tabs were dead ends. First-time users had no obvious loop to follow.

**New decision (v2):**
Every empty state now includes:
- A short explanation of what the screen WILL show
- A **suggested action** with a real button leading to the most likely next step
- A preview/example of what a populated version looks like (where helpful)

Example: empty Sandbox tab no longer says "open a Brief" — it shows the most recent Brief's first exercise *as a recommended starter*, with a "Start with this one →" button.

**Reasoning:**
A teacher opening the app for the first time should never hit a dead end. Every screen leads somewhere.

---

## DEV-004 · 2026-06-20 · Typography: precious whisper → confident reading

**Previous decision (v1):**
Newsreader serif at 18px for body, 32px for titles, with tight letter-spacing and italics for empty states. Mono-uppercase 11px "eyebrow" labels on nearly everything.

**Problem reported:**
> "The font is not on point."

The serif felt precious/old-fashioned. Eyebrow labels everywhere made the app feel like a CLI/dev-tool.

**New decision (v2):**
- Serif: **Fraunces** (or Source Serif 4 fallback) — friendlier, more contemporary, with a hint of personality. Same humanist family, less austere.
- Body sizes step up: titles 30–34px (was 28–32), body 17–18px (was 18 but with cramped leading)
- Sans-serif Inter for all UI/chrome
- **Eyebrow labels** kept ONLY inside long-form Brief content (section markers) — removed from everywhere else

**Reasoning:**
Readability and warmth come first. The serif should feel like a quality paperback (Penguin Modern Classics), not a museum placard.

---

## DEV-005 · 2026-06-20 · Subject identification: text-only → color-coded

**Previous decision (v1):**
Subjects appeared only as text inside a generic mono-uppercase pill. All pills looked identical regardless of subject.

**Problem reported (anticipated):**
A teacher who teaches 3 subjects across 4 grades has no fast way to spot "what's new in Chemistry" in their Feed. They have to read every card.

**New decision (v2):**
Each subject has a designated muted color. Every card shows a small colored dot (or vertical color strip) next to the title. The subject pill gets a soft tint of that same color.

**Reasoning:**
Color does real navigational work. The Feed becomes scannable in seconds.

**Subject → color mapping** (locked here so it stays consistent across the app):
| Subject | Color | Hex |
|---|---|---|
| Chemistry | sage | `#7A8B6F` |
| Biology | sage-teal | `#6B8E7F` |
| Kiswahili | peach | `#E8A87C` |
| ICT | soft blue | `#8FA5B8` |
| History & PE | clay | `#B85C38` |
| Mathematics | lavender | `#9B8AB8` |
| English | warm gold | `#C9A55C` |
| All / cross-subject | ink-2 | `#5C544A` |

---

## DEV-006 · 2026-06-20 · Color: add tasteful "pop" moments

**Previous decision (v2):**
v2 used peach + sage + clay, but most surfaces stayed warm-neutral. Color was used carefully but might have been *too* careful — accents weren't quite "popping" enough to feel alive.

**Problem reported:**
> "We should make it a bit more so that some colours pop a bit more. Some kind of bright colour, not so bright, but we make it a bit brighter to be a bit more noticeable."

**New decision (v2.1):**
Introduce **two bright accent tones** used purposefully and sparingly:
- `--coral` `#FF7F5C` — for the "Start here" tag, primary CTAs on key conversion moments, and the streak indicator. A confident coral, not a panic red.
- `--gold-bright` `#F2B441` — for completion / success states (replaces some sage-soft fills). Saturated enough to feel celebratory without confetti.

Also: deepen `--sage` from `#7A8B6F` → `#5F7A5C` for stronger "done" semantics, and bump `--peach-deep` saturation slightly.

**Reasoning:**
The warm cream foundation is right. But moments that matter — "do this now", "you did it", "this is your streak" — should feel like a moment, not a whisper. One brighter color per surface, never two.

**Tracked across:** `app/src/app/globals.css`, `preview.html`

---

## DEV-007 · 2026-06-20 · Desktop/laptop layout (was mobile-stretched)

**Previous decision:**
Single max-width container (`max-w-[640px]` mostly). Same layout at any screen size. Designed phone-first, did nothing special on desktop — the result felt like "phone app stretched to a window."

**Problem reported:**
> "We should also optimise it for someone using it on a laptop. On the laptop it still looks a bit off, but on the phone it looks very good. On the laptop it looks like it should be for the phone."

**New decision (v2.1):**
Proper responsive layout for ≥1024px (`lg`) breakpoint:

1. **Persistent left sidebar nav** on desktop (the bottom TabBar hides). Sidebar shows: brand, primary nav (Feed/Sandbox/Ledger/Me), and a "What I teach" subjects card at the bottom.
2. **Two-column reading layout** on Brief pages — main 65ch column for content + a sticky right rail (240px) for: section nav (scroll-spy), metadata, AI contribution note. Mobile keeps single column.
3. **Feed becomes a multi-column grid** at ≥1280px — 2 columns of cards. The recommended card spans full width and is taller.
4. **Max content widths** that respect reading research: 65ch for prose, 920px for grid views, 1280px container max.

Mobile design is 100% unchanged — only adds desktop affordances above the breakpoint.

**Reasoning:**
A teacher reading a Brief on her phone wants a column. A head teacher reviewing the Ledger on her laptop wants a sidebar and breathing room. Same product, two layouts. This is also where most investors/admins will see Sasa for the first time, so it has to look at home on a 14" MacBook.

**Tracked across:** `app/src/components/shell/SideNav.tsx` (new), `app/src/app/(app)/layout.tsx`, all page components

---

## DEV-008 · 2026-06-20 · Readability bumps

**Previous decision (v2):**
Body serif: 17.5px / 1.65 line-height. Card titles: 17-22px. Felt comfortable but compact.

**Problem reported:**
> "We should just increase the readability while keeping our design."

**New decision (v2.1):**
- Brief body: 17.5px → **18.5px** / 1.65 → **1.7**
- Feed card titles: 17px → **18px**, recommended 24px → **26px**
- Settings row labels: 15px → **16px**
- Stronger text contrast: `--ink-2` from `#5C544A` → `#4A4239` (deeper)
- Generous paragraph spacing kept; only the type sizes and contrast move.

**Reasoning:**
A teacher reading on a Tecno screen in a noisy staffroom needs every readability advantage. Restraint cost us comfort. Bumping ~1px of size and a touch of contrast costs nothing and pays back every read.

**Tracked across:** `app/src/app/globals.css`

---

## DEV-009 · 2026-06-20 · Settings: drop dead-end rows

**Previous decision (v2):**
Me tab had 7 settings rows including "Notifications", "About Sasa" — but those don't go anywhere yet (no auth, no notification system, no About page).

**Problem reported:**
> "I saw the settings there and could remove some of them, because some of them are not pointing to a dead end now."

**New decision (v2.1):**
Settings now shows only what's real (or honestly-labeled "Coming soon"):
- **Real now:** Subjects & grades, Greeting language, Sign out
- **Honestly coming:** Notifications (with "Coming soon" muted hint), Download for offline ("Coming soon"), Export Retooling Passport ("Phase E")
- **Removed:** "About Sasa" (no such page yet)

Settings can grow back as features ship. Better 3 honest rows than 9 aspirational ones.

**Reasoning:**
Founder's fundamental rule: don't pretend functionality exists when it doesn't. Honesty builds trust faster than completeness.

**Tracked across:** `app/src/app/(app)/me/page.tsx`

---

## DEV-010 · 2026-06-20 · Liquid glass: tighter, brighter highlights

**Previous decision (v2):**
Glass bars used `color-mix(in srgb, var(--cream) 78%, transparent)` + 20px blur. Worked but slightly muddy on white-cream backgrounds.

**New decision (v2.1):**
- Increase blur 20px → 28px (more separation from content)
- Bump opacity slightly (78% → 82%) for clearer legibility
- Add a stronger inner-top highlight (the "edge-lit" Apple effect) and a soft outer drop shadow so the bar floats more obviously
- New glass-card variant for the desktop sidebar

**Reasoning:**
Glass is the one premium signal we keep. If we keep it, it should be its best version.

**Tracked across:** `app/src/app/globals.css`, `preview.html`

---

## DEV-011 · 2026-06-20 · Em dashes removed from user-facing copy

**Previous decision:**
Em dashes (—) used liberally throughout UI copy, briefs, button labels. They're valid punctuation, but...

**Problem reported:**
> "People really refer to them as AI tells."

Em dashes in 2026 have become a public marker of AI-generated text. Even when used correctly, they undermine the founder's brand goal: looking like a thoughtful Ugandan-built product, not a ChatGPT export.

**New decision:**
- Strip every em dash (—) and en dash (–) from **user-facing strings**: UI labels, brief titles, brief bodies, button copy, empty-state messages, marketing pages.
- Replace with: period + new sentence, comma, colon, parentheses, or "and"/"to" depending on context.
- Keep dashes in **internal-only docs** (CHANGELOG, STATUS, HANDOFF, design philosophy, this file). Those aren't user-visible and rewriting them costs a lot for zero gain.

**Reasoning:**
Trust signal matters more than punctuation purity. The teacher reading a Brief should never have a "this was written by AI" reaction, even subconsciously.

**Tracked across:** all 5 MDX briefs in `content/updates/`, `preview.html`, all `app/src/app/` pages, the onboarding flow

---

## DEV-012 · 2026-06-20 · Free-tier AI grading (Groq + Gemini hybrid)

**Previous decision (D-001):**
Anthropic Claude Sonnet for Sandbox grading. Pay-as-you-go, ~$0.40 per Sandbox.

**Problem reported:**
> "I really do not have a budget right now."

We need to ship a working v0 before any spending. Paid Claude was blocking Phase D entirely.

**New decision:**
Hybrid free-tier AI architecture:
- **Primary:** Groq (Llama 3.3 70B) — free, no credit card, 30 req/min, 6000 tokens/min. Inference is extremely fast (~500ms typical).
- **Fallback:** Google Gemini 2.0 Flash — free, 15 req/min, 1500/day. Used if Groq rate-limits.
- **Architecture:** Single `gradeResponse()` server action that tries Groq, catches 429 errors, falls back to Gemini, returns the response in a model-agnostic shape.
- **Future-proof:** Swap to paid Claude Sonnet later by changing one provider line. Construct-citing system prompt stays identical.

**Both providers' free tiers are sufficient for our demo and first ~50 active teachers.**

**Reasoning:**
v0 demo must work. Paid AI was the only Phase D blocker. Llama 3.3 70B writes calm, citation-following English well enough for our use case. Founder will upgrade to Claude when revenue justifies it.

**Cost:** $0. Founder still creates the API keys (still MT-010 + new MT-011), but signups are free, no card required.

**Tracked across:** `docs/ops/SECRETS_AND_KEYS.md` rewritten for free tiers, `docs/ops/MANUAL_TASKS.md` updated (MT-010 + MT-011 both free)

---

## DEV-013 · 2026-06-20 · No auth in v0 (defer to Phase F)

**Previous decision:**
Clerk for auth in Phase F. Required for personalized Ledger, profile, progress.

**Problem reported:**
> "I really do not have a budget right now... even the sign in page, so I don't know if we can pull this off."

Plus founder noted: *"For now we don't really need a signup page since we're going to showcase this app."*

**New decision:**
v0 ships with **no real authentication**. The "Profile" tab shows a hard-coded placeholder identity (Nakato Sarah at St. Mary's Kisubi). Onboarding completion stores its result in `localStorage` only.

When founder navigates to `/onboarding` they see the flow. When they finish, it sets a localStorage flag and redirects to `/feed`. From then on, future `/` visits skip onboarding.

A small "Sign in" link in the profile tab marks where real auth will live (Phase F).

**Reasoning:**
- The showcase doesn't need accounts.
- Clerk's free tier (10k MAU, email-only) exists if we need it later — costs $0 but adds setup friction now.
- Real auth requires DB + webhooks + middleware. Skipping it lets us ship Phase D much faster.

**Reversal cost:** Low. Add Clerk later when MT-020 is done; the `(app)` route group is already wrapped, just bolt on the middleware.

**Tracked across:** `app/src/app/page.tsx` (localStorage check for first-visit redirect to onboarding), `app/src/components/onboarding/OnboardingClient.tsx` (write to localStorage at end), `MANUAL_TASKS.md` (MT-020 demoted from blocker to "later")

---

## DEV-014 · 2026-06-20 · TTS deferred (visual placeholder for v0)

**Previous decision:**
ElevenLabs TTS for Brief audio in Phase F.

**Problem reported:** budget concern (DEV-013 fallout).

**New decision:**
Speaker icon stays visible in the Brief top bar (and desktop right rail). Tapping it shows a friendly toast: *"Listening coming soon."* No real audio.

When budget arrives, options ranked by cost:
1. **Browser native Web Speech API** ($0, decent quality, works today) — could ship if founder changes mind
2. **ElevenLabs free tier** (10k chars/mo)
3. **Real human-recorded Ugandan voice** (Year 1 goal)

**Reasoning:**
Audio narration was always "nice to have for v0." Founder explicitly said budget is the blocker. Visual placeholder preserves the product's promise without spending.

**Tracked across:** `app/src/app/(app)/feed/[slug]/page.tsx` (speaker button gets a Coming soon toast), `preview.html` (same)

---

## DEV-015 · 2026-06-20 · Onboarding gating note

**Observation (not yet a behavior change):**
> "When I typed localhost:3000, it took me directly to the feed. I had to type /onboarding to see it."

This is correct current behavior — by design, since we have no auth. But noted as a future requirement: real first-time-visitor flow needs to detect "have I been here before?" and route accordingly.

**v0 quick fix (DEV-013):** Use `localStorage` to track "onboarding seen." First-ever visit redirects `/` → `/onboarding`. Subsequent visits go to `/feed`.

**Real fix (Phase F):** Once auth lands, gate on `user.onboarded === true` in the DB.

**Tracked across:** `app/src/app/page.tsx` (becomes a client component with localStorage check)

---

## Template for future deviations

```markdown
## DEV-NNN · YYYY-MM-DD · <short title>

**Previous decision:** <what we used to do, link to spec>
**Problem reported:** <quote or summary of why it didn't work>
**New decision:** <what we're doing now>
**Reasoning:** <why this serves the user better>
**Tracked across:** <files changed>
```
