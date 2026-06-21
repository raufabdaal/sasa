# Project Status

> **Last updated:** 2026-06-21 (session 2026-06-21-002) by Agent
> **Current phase:** Phase D live + structured "thought-walk" feedback shipped
> **Live URL:** https://sasa-omega-rosy.vercel.app
> **Local preview:** double-click `preview.html`

---

## 🎯 Current goal

**Done this session:** AI feedback restructured from paragraph to thought-walk (You said / NCDC says / The gap / Try this) with per-construct alignment chips and traffic-light colors. Added a real session summary screen after the last exercise (Where you were strong / Where to grow / Try this on Monday).

**Next goal:** Founder pushes 4 files, tests live, gives feedback on the new UX. Then we pick the next direction.

---

## 📊 Phase overview

| Phase | Status | Notes |
|---|---|---|
| Phase 0 — Specs & ops | ✅ Done | |
| Phase A — Foundation | ✅ Done | |
| Workspace cleanup | ✅ Done | |
| Design v2 + v2.1 | ✅ Done | |
| Free-tier strategy | ✅ Done | Groq |
| GitHub + Vercel deploy | ✅ Done | https://sasa-omega-rosy.vercel.app |
| Phase D — AI grading | ✅ Done | Real Groq AI live |
| **Structured feedback** | ✅ **Done this session** | Thought-walk + session summary |
| Phase E — Ledger persistence + PDF | 🔜 | Free, no auth needed yet (localStorage path) |
| Phase F — Auth + DB + TTS + PWA | 💤 | When budget allows |
| Phase G — Admin ingest console | 🔜 | After F |
| Phase H — Custom domain | 🔜 | When ready (MT-031) |

---

## ✅ Done this session

- [x] Restructured `lib/grading.ts` to return JSON (per-exercise + summary)
- [x] Added `summarizeSession()` function
- [x] `/api/grade` now handles `mode: "exercise"` AND `mode: "summary"`
- [x] JSON parser strips markdown fences if AI adds them
- [x] JSON validator with forbidden-word check
- [x] SandboxClient feedback rebuilt as thought-walk: alignment header / per-construct chips / NCDC citation / 3 walk rows
- [x] Session wrap-up screen with structured summary + gold pulse
- [x] Fallback summary generated client-side if AI summary call fails
- [x] Build verified clean

---

## 🟡 In progress
*(nothing — handing back to founder)*

---

## ⏭️ Next (priority order)

### Right now
1. Founder pushes 4 files (see HANDOFF.md) and tests live
2. Founder paste feedback from a real session run

### Likely next session
3. Pick a direction from these (all free, no key needed):
   - Ledger persistence in localStorage (completed Sandboxes actually save)
   - PDF Retooling Passport export
   - Scroll-spy section labels in Brief
   - Reading-progress 1px line at top of Brief
   - Search across past Briefs

### Phase F (when budget allows)
4. Clerk email auth → MT-020 → MT-021 → real DB persistence

---

## 🔴 Blocked
*(nothing)*

---

## 🔑 Keys & accounts

| Service | Used for | Status |
|---|---|---|
| Groq API | AI grading | ✅ Live (key in Vercel env + founder's local .env.local) |
| Vercel | Hosting | ✅ Connected with auto-deploy |
| Domain | Phase H | ⏳ MT-031 (~UGX 100k/yr when ready) |
| Clerk | Phase F | 💤 Deferred (free tier when ready) |
| Neon Postgres | Phase F | 💤 Deferred |

---

## 📋 Manual tasks status

- ✅ MT-001 Project name: Sasa
- ✅ MT-002 pnpm
- ✅ MT-003 GitHub repo
- ✅ MT-010 Groq API key obtained
- 🚫 MT-011 Gemini (dropped)
- ✅ MT-012 GROQ_API_KEY in Vercel
- ⏳ MT-060 Ongoing pushes (Path D workflow)

---

## 📝 Notes from this session

- Founder's intuition was spot-on: a single paragraph buries the most useful info. Structured walk-through with section labels lets the eye land where it needs to.
- The traffic-light colors are intentionally muted: sage (not bright green), peach-deep (not red-orange), clay (not danger-red). Same restraint principle as the rest of the design — colors signal alignment without judging the teacher.
- The session summary calls a SECOND AI endpoint after the last exercise. This is the first multi-step AI flow in Sasa. If founder loves it, this pattern unlocks future features like "term review" or "subject coach" summaries down the line.
- Total AI calls per Sandbox: 4 (3 exercises + 1 summary). Well within Groq's 30/min free tier.
- The fallback summary is generated client-side from the alignment data we already collected — so even if Groq is fully down, the wrap-up screen never breaks.
