# Sasa

> *"The curriculum changed. The textbooks changed. The exams changed. But the support for teachers never did."*

Sasa is an EduTech platform for Ugandan secondary-school teachers adapting to the new Competency-Based Curriculum (CBC). It turns every NCDC circular and UNEB update into a 7-minute Brief, a hands-on Sandbox exercise, and a Retooling Passport teachers can show their head teacher.

---

## 🚀 See it

**Two ways** — pick what fits your moment. Full instructions in **[`START_HERE.md`](START_HERE.md)**.

| Option | What you do | What you get |
|---|---|---|
| 🟢 **Quick look** | Double-click `preview.html` | Visual preview of all screens. No install. |
| 🔵 **Real app** | Run `./launch.sh` (mac/Linux) or `launch.bat` (Windows) | Interactive Next.js app at http://localhost:3000 |

---

## 📂 Project layout

```
sasa/
├─ START_HERE.md           👈 read this first
├─ preview.html            👈 double-click to view all screens
├─ launch.sh / launch.bat  👈 run the real interactive app
│
├─ app/                    🟢 the Next.js application
├─ content/updates/        ✍️ Briefs (MDX files)
│
├─ docs/
│   ├─ spec/               📘 PRD, design philosophy, data architecture, user flows
│   ├─ ops/                🔧 secrets, manual tasks, decisions, session ritual
│   ├─ prompts/            🧠 AI build prompts
│   └─ visual-mockup.html  🎨 older standalone design preview
│
├─ STATUS.md               🟡 what's done / what's next (UPDATED EVERY SESSION)
├─ HANDOFF.md              🟡 latest session snapshot
├─ CHANGELOG.md            history
└─ .env.example            environment template
```

---

## 🧭 What to read, by role

| You are... | Read |
|---|---|
| **Wanting the one-glance status** | **`CHECKLIST.md`** |
| **Coming back to the project** | `STATUS.md` → `HANDOFF.md` → recent `CHANGELOG.md` entry |
| **A new collaborator** | `START_HERE.md` → `docs/spec/PRD.md` → `docs/spec/design-philosophy-v2.md` |
| **A founder/PM setting up keys** | `docs/ops/SECRETS_AND_KEYS.md` + `docs/ops/MANUAL_TASKS.md` |
| **An AI agent / coder picking up the build** | `docs/prompts/master-build-prompt.md` + `STATUS.md` + `CHECKLIST.md` |
| **An investor** | Open `preview.html`, then `docs/spec/PRD.md` |

---

## 🎯 Current phase

**Phase A is ✅ complete** — Next.js shell, design tokens, Feed, Brief, and 5 seed Briefs are working locally.

**Next:** Phase B/C polish (animations, onboarding) or Phase D (Sandbox AI grading — requires Anthropic key).

See `STATUS.md` for the live state.

---

*Built in Kampala. For Ugandan teachers.*
