# User Flows
### From "I got a UNEB circular" to "I can teach it tomorrow"

---

## Flow 1 — First-time onboarding (~ 2 minutes)

```
Splash (logo fades in, no tagline)
   │
   ▼
Sign in — phone OTP OR email
   │
   ▼
"What do you teach?"
   • Pick level (O-Level / A-Level / Primary)
   • Pick subjects (multi-select chips, max 4)
   • Pick grades (S1–S6)
   │
   ▼
"Where do you teach?"
   • School (typeahead — pre-seeded with all 4,000+ UG sec schools)
   • District (auto-fills)
   │
   ▼
"How would you like to be greeted?"
   • Name (first name only)
   • Preferred language for greetings (English / Luganda / Runyankole / Luo / Ateso)
   │
   ▼
"You're 6 updates behind. Want to catch up?" [Start] [Later]
   │
   ▼
Feed
```

**Design notes:**
- 4 screens, no progress bar (it would imply burden). Each transitions left-to-right with a 280ms spring.
- The "6 updates behind" number is computed from `published_at > user.created_at - 90 days` filtered by their subjects.

---

## Flow 2 — Daily use: reading a Brief (~ 7 minutes)

```
Feed (chronological cards, newest first)
   │  Each card: subject pill | title | "5 min read" | "New" dot
   ▼
Tap a card
   │
   ▼
Brief opens — full screen, serif body
   ┌─────────────────────────────────────┐
   │  [back]              [audio] [save] │  ← liquid glass top bar
   │                                     │
   │  CHEMISTRY · S3 · JUNE 2026         │
   │  Construct weights revised          │
   │                                     │
   │  Context ─────────────              │
   │  In the original 2020 syllabus...   │
   │                                     │
   │  The Change ─────────                │
   │  [animated before/after table]      │
   │                                     │
   │  Why ─────────                       │
   │  ...                                │
   │                                     │
   │  Classroom Example ─────────         │
   │  ...                                │
   │                                     │
   │  Common Pitfall ─────────            │
   │  ...                                │
   │                                     │
   │  ─────────────────────              │
   │  [ Try it in the Sandbox → ]        │
   └─────────────────────────────────────┘
```

**Micro-interactions:**
- As the user scrolls, the section name in the top bar updates (sticky section labels)
- The "before/after" diff animates *only once* when scrolled into view
- Audio player is a thin pill at the bottom — tap to play, swipe down to dismiss
- Reading progress is a 1px line at the very top, almost invisible. No %.

---

## Flow 3 — The Sandbox (~ 5 minutes)

```
From Brief, tap "Try it in the Sandbox"
   │
   ▼
Sandbox loads — split screen on tablet, stacked on phone
   ┌─────────────────────────────────────┐
   │  Exercise 1 of 3 · Re-grade         │
   │                                     │
   │  Here is a real S3 student's        │
   │  response to a Chemistry AOI:       │
   │  ┌─────────────────────────────┐   │
   │  │ [Student's handwritten      │   │
   │  │  answer, transcribed]       │   │
   │  └─────────────────────────────┘   │
   │                                     │
   │  Apply the NEW construct weights    │
   │  (30/30/40) to grade this.          │
   │                                     │
   │  Knowledge:     [ A B C D E ]       │
   │  Skill:         [ A B C D E ]       │
   │  Application:   [ A B C D E ]       │
   │  Values:        [ A B C D E ]       │
   │                                     │
   │  Your reasoning (optional):         │
   │  [_________________________]        │
   │                                     │
   │  [ Submit ]                         │
   └─────────────────────────────────────┘
   │
   ▼
AI feedback appears INLINE (no modal)
   ┌─────────────────────────────────────┐
   │  ✓ Your grade aligns with the       │
   │    official construct descriptor.   │
   │                                     │
   │  NCDC says: "A response that links  │
   │  the chemical equation to a real-   │
   │  world application earns B or       │
   │  higher in Application."            │
   │                                     │
   │  Your B for Application matches.    │
   │                                     │
   │  One nuance: NCDC weights Values    │
   │  at 10% — your D pulls the final    │
   │  closer to C than your other        │
   │  scores suggest.                    │
   │                                     │
   │  [ Next exercise → ]                │
   └─────────────────────────────────────┘
```

**Critical design rules:**
- Never the word "wrong" or "incorrect"
- Always cite the official descriptor by name
- Feedback is calm prose, not score cards
- The teacher can always tap "I disagree" → opens a dispute thread (we review)

---

## Flow 4 — Completion & The Ledger

```
After 3rd sandbox exercise:
   │
   ▼
A single check mark fades in. No confetti. No modal.
   "Added to your Ledger."
   │
   ▼
The card physically falls from the Brief into the Ledger tab
(animation: 1 time only, spring, ~600ms — this is THE moment)
   │
   ▼
Streak dot updates (+1 ring)
   │
   ▼
User returned to Feed, the completed card now greyed at the bottom
```

---

## Flow 5 — Catch-up mode (the lapsed teacher)

```
Teacher opens Sasa after 3 weeks away
   │
   ▼
Feed shows banner: "Welcome back. 8 updates since you were last here. ~52 minutes."
   │
   ▼
Two options:
   [ Show me what changed ]   ← opens prioritized list (by their subjects)
   [ I'll browse ]            ← normal feed
   │
   ▼
"Show me what changed" → a curated mini-playlist
   - Sorted by: (a) affects subjects they teach, (b) recency
   - One-tap "Mark as read without sandbox" for purely informational updates
```

---

## Flow 6 — Export Retooling Passport

```
Profile → Ledger → "Export Passport"
   │
   ▼
Modal:
   "Your Retooling Passport will include:
    • Your name & school
    • 47 curriculum updates you have internalized
    • Your average Sandbox alignment score: 84%
    • Dated, signed by Sasa (and NCDC, once we partner)
    [Generate PDF]"
   │
   ▼
PDF generated. Opens in browser. Downloads.
Looks like a university transcript. Heavy serif. Brass seal.
   │
   ▼
Share sheet appears: WhatsApp, Email, Print
```

---

## What's NOT in v1

- Social feed / following other teachers
- DMs between teachers
- Live video lessons
- Student-facing anything
- Marketplace
- Subscriptions UI (we're free for teachers in v1)
