# Handoff Note

> Overwritten every session. Previous lives in `CHANGELOG.md`.

---

## Session ID
`2026-06-20-005` (free-tier, em dash purge, onboarding gate, completion celebration)

## What I worked on this session

Founder gave a clean diagnosis after running the v2.1 app:
1. App goes straight to `/feed` instead of `/onboarding` on first visit (correct current behavior, but worth fixing for v0 demo)
2. Em dashes everywhere read as "AI tells"
3. Listen / Save icons should stay visible but defer the work
4. **NO BUDGET right now**, but still wants AI grading + read-aloud + sign-in if possible
5. Approved free polish

**All five addressed:**

### 1. Free-tier strategy (DEV-012, DEV-013, DEV-014)
- Anthropic Claude → swapped for **Groq + Gemini** (both genuinely free, no credit card)
- Clerk auth → **deferred entirely for v0**, localStorage takes its place
- ElevenLabs TTS → **deferred**, speaker icon shows polite "Listening coming soon" toast
- Founder still creates 2 free API keys (Groq, Gemini) when they want real AI on; until then, stand-in feedback is in place

### 2. Em dash purge (DEV-011)
- Python script + manual fixes removed every em/en dash from user-facing surfaces
- 5 MDX briefs, all TSX pages, all JSX text, preview.html
- Internal docs (CHANGELOG, STATUS, design philosophy) keep their dashes since users never see them

### 3. Onboarding gate (DEV-015)
- Root page `/` is now a client component that checks `localStorage.sasa.onboarded`
- First-time visitor → redirected to `/onboarding`
- Subsequent visits → `/feed`
- Brief "Opening Sasa" splash while it decides (should flash for ~50ms)
- Onboarding's final CTAs ("Show me what's new" / "I'll just browse") now both set the flag and route via `router.push('/feed')`

### 4. Coming-soon toast (DEV-014)
- New `<ComingSoonAction kind="listen" | "save" />` client component
- Speaker icon → toast "Listening coming soon."
- Bookmark icon → toast "Saving coming soon."
- Desktop right rail: same icons but rendered as passive labels with "Soon" hint (no toast needed for static text)

### 5. Completion celebration (free polish #1)
- When user finishes last Sandbox exercise, they now see:
  - Gold halo pulse (one time only, ~700ms, never repeats)
  - Solid gold circle with check mark
  - "You're done." in big serif
  - "Added to your Ledger" subtitle
  - Two clear CTAs: "See your Ledger" (primary coral) + "Back to Feed" (secondary)

### 6. Docs updated
- `SECRETS_AND_KEYS.md`: § 1 is now Groq, § 1b is Gemini, § 1c notes Anthropic deferred
- `MANUAL_TASKS.md`: MT-010 free Groq, new MT-011 free Gemini, MT-020 Clerk marked deferred
- `.env.example`: Groq + Gemini + AI_PROVIDER selector
- `CHECKLIST.md`: full re-count (69 done, 42 left, 62%)
- `DESIGN_DEVIATIONS.md`: DEV-011 to DEV-015 logged
- `CHANGELOG.md`: 0.2.2 version block

## What I did NOT change
- The actual coral/peach/sage color tokens (founder is happy)
- Mobile layout (untouched)
- Desktop layout (untouched)
- The 4 onboarding steps' content/structure (just the routing on completion)

---

## Where we are right now

**Build is clean. 19 routes prerender.**

When founder runs `launch.bat` and visits `localhost:3000`:
- Sees a brief "Opening Sasa" splash, then redirected to `/onboarding` (first time)
- Completes onboarding, lands on `/feed`
- Future visits skip onboarding, go straight to `/feed`
- All copy is em-dash-free
- Speaker icon in Brief shows polite toast when tapped
- Completing all 3 Sandbox exercises triggers the gold-pulse celebration

To reset and try onboarding again: open DevTools → Application → Local Storage → delete `sasa.onboarded`.

## What's broken
Nothing.

## What's running
Nothing in this sandbox. Founder runs locally.

---

## To resume cleanly, next session should:

1. Read `STATUS.md` → `HANDOFF.md` → `CHANGELOG.md` (last entry)
2. Check `CHECKLIST.md` for the at-a-glance state
3. Ask founder what direction:
   - **Phase D (real AI grading)** — needs founder to do MT-010 + MT-011 (both free, ~6 min total)
   - **More free polish** — scroll-spy section labels, reading-progress bar, search
   - **More Sandbox exercise types** — currently only `regrade` has full UI; build `rewrite`, `plan_opener`, etc.

---

## Open questions for the founder

- [ ] **Try the onboarding flow** — visit `localhost:3000`, you should auto-route to `/onboarding`. Walk through it and tell me if the flow feels right
- [ ] **Try finishing a full Sandbox** — open a Brief, hit "Try it in the Sandbox", grade all 4 constructs A-E on 3 consecutive exercises, see the completion celebration
- [ ] **Em dashes** — any you spotted I missed? Let me know exactly where
- [ ] **MT-010 + MT-011** — willing to spend 6 minutes creating two free API keys to unlock real AI? Both signups have no credit card, no payment ever

---

## Files touched this session

```
NEW
+  app/src/components/brief/ComingSoonAction.tsx

REWRITTEN
M  app/src/app/page.tsx                              (client component with localStorage gate)
M  app/src/components/onboarding/OnboardingClient.tsx (finishOnboarding writes flag)
M  app/src/components/sandbox/SandboxClient.tsx     (completion celebration)
M  app/src/app/(app)/feed/[slug]/page.tsx          (ComingSoonAction in top bar; passive labels in rail)
M  app/src/app/(app)/ledger/page.tsx                (em dashes)
M  app/src/app/(app)/me/page.tsx                    (em dashes)
M  preview.html                                     (em dash purge + toast script)
M  content/updates/*.mdx (all 5)                    (em dash purge)
M  .env.example                                     (Groq+Gemini)
M  docs/ops/SECRETS_AND_KEYS.md                     (free-tier path)
M  docs/ops/MANUAL_TASKS.md                         (MT-010 free, MT-011 added, MT-020 deferred)
M  docs/spec/DESIGN_DEVIATIONS.md                   (DEV-011 to DEV-015)
M  CHECKLIST.md                                     (recount)
M  STATUS.md  CHANGELOG.md  HANDOFF.md
```

---

## End-of-session ritual completed?
- [x] CHANGELOG.md updated (0.2.2)
- [x] STATUS.md updated
- [x] HANDOFF.md overwritten (this file)
- [x] CHECKLIST.md updated
- [x] DESIGN_DEVIATIONS.md updated (DEV-011 through DEV-015)
- [x] Build verified, 19 routes prerender

---

## Previous session ID
`2026-06-20-004` (v2.1 brighter pops, desktop layout, readability, onboarding flow)
