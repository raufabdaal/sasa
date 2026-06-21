# 👋 Start Here

> **You want to see Sasa. Here are two ways — pick the one that suits you.**

---

## 🟢 Option 1 — Just look at it (zero install, 5 seconds)

**Double-click `preview.html`** in this folder.

It opens in your browser. You'll see all the key screens — Feed, Brief, Sandbox, AI Feedback, Ledger, and the Retooling Passport — laid out on a phone frame. Use the tabs at the top (or your keyboard's ← → arrows) to switch between scenes.

This is a **visual preview**. Nothing is clickable inside the phone (no real navigation, no real AI). It's for showing investors, getting a feel for the design, or just confirming what we're building. No setup of any kind.

---

## 🔵 Option 2 — Run the real app (interactive, ~5 min setup)

This is the actual product. Real navigation between screens. When we add AI grading and auth and the rest, *this* is where they go.

### Prerequisites (one-time, ~5 minutes)
1. **Node.js v20+** — check with `node --version`. If missing, install from **https://nodejs.org** (LTS version).
2. **pnpm** — check with `pnpm --version`. If missing: `npm install -g pnpm`

### Run it
From this `sasa/` folder, in a terminal:

```bash
./launch.sh         # macOS / Linux
launch.bat          # Windows (or just double-click in Explorer)
```

The launcher will install dependencies if needed and start the dev server. When it's ready:

**Open http://localhost:3000 in your browser.**

To stop: hit `Ctrl + C` in the terminal.

---

## Which should you use?

| If you want to… | Use |
|---|---|
| **Quickly show someone the design** | `preview.html` |
| **Get a feel for the product on your own** | `preview.html` |
| **Show an investor / advisor on a phone or laptop** | `preview.html` |
| **Actually click between screens, read all 5 Briefs, scroll through real content** | `./launch.sh` |
| **Eventually try the AI Sandbox, sign in, export the Passport PDF** | `./launch.sh` (once those features are built) |

---

## 📂 Folder map

```
sasa/
│
├─ START_HERE.md           👈 you're reading this
├─ preview.html            👈 OPTION 1 — double-click to view
├─ launch.sh / launch.bat  👈 OPTION 2 — run the real app
│
├─ app/                    🟢 the actual Next.js application
├─ content/                ✍️ the Briefs (MDX files you can edit)
│
├─ docs/                   📚 all documentation
│   ├─ spec/                 - PRD, design philosophy, etc.
│   ├─ ops/                  - secrets, manual tasks, decisions
│   ├─ prompts/              - AI build prompts
│   └─ visual-mockup.html    - older marketing-page mockup (different from preview.html)
│
├─ README.md
├─ STATUS.md               🟡 what's done / what's next
├─ HANDOFF.md              🟡 latest session snapshot
├─ CHANGELOG.md            history
├─ .env.example            environment template
└─ .gitignore
```

### Difference between `preview.html` and `docs/visual-mockup.html`

| | `preview.html` (new) | `docs/visual-mockup.html` (older) |
|---|---|---|
| What | Interactive multi-screen preview of the *app* | Single-page marketing/spec preview |
| Best for | Seeing what each screen looks like | Reading the pitch + design rationale |
| Has phone frames? | Yes | No |
| Has a scene switcher? | Yes (Feed / Brief / Sandbox / etc.) | No |

Both are pure HTML — double-click either.

---

## ❓ Troubleshooting (Option 2 only)

### `preview.html` opens but looks unstyled
Make sure you're opening it from your file system (double-click), not as plain text. Try right-click → "Open With" → your browser.

### `./launch.sh` says permission denied
```bash
chmod +x launch.sh
./launch.sh
```

### Port 3000 is in use
```bash
cd app && pnpm dev -- -p 3001
```
Then visit http://localhost:3001.

### Anything else
Tell me the exact error and what you did right before.

---

## 🧭 Where to go next

| If you want to… | Read |
|---|---|
| **See what's done and what's left** | **`CHECKLIST.md`** — one-glance progress board |
| Understand the product | `docs/spec/PRD.md` |
| See design intent in text form | `docs/spec/design-philosophy-v2.md` |
| Know what we're working on right now | `STATUS.md` |
| Know why we changed a design decision | `docs/spec/DESIGN_DEVIATIONS.md` |
| Set up an API key | `docs/ops/SECRETS_AND_KEYS.md` |
| See what tasks need YOU | `docs/ops/MANUAL_TASKS.md` |
