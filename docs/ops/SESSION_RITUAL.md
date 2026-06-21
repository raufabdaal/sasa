# The Session Ritual

> **Three commands at the start. Three commands at the end. That's it.**
> This keeps documentation alive instead of stale.

---

## 🌅 Start of every session

The agent runs (or asks you to run) these in order:

### 1. Read the state
```
Read in this order:
  1. STATUS.md       (where are we right now?)
  2. HANDOFF.md      (what did the last session leave behind?)
  3. CHANGELOG.md    (recent history — last 2 entries are enough)
```

### 2. Check for new blockers / manual tasks
```
Open MANUAL_TASKS.md
  → Any 🔒 blockers still ⏳ that should be ✅?
  → Any new ones to add?
```

### 3. Announce the plan
The agent writes a short message in chat:
> *"This session I plan to: [X, Y, Z]. Blockers: [none / MT-### waiting]. Estimated time: [N minutes]."*

You either approve or redirect.

---

## 🌇 End of every session

Three updates, in this order:

### 1. Update `CHANGELOG.md`
Add a new dated entry under `## [Unreleased]` OR cut a new version block.

Template:
```markdown
## [0.X.Y] — YYYY-MM-DD — *short session name*

### Added
- <thing> (`path/to/file.ts`)

### Changed
- <thing> (`path/to/file.ts`) — <why>

### Fixed
- <bug> (`path/to/file.ts`)

### Decision
- D-XXX: <title> — logged in `docs/ops/DECISIONS.md`

### Ops
- <env var / service change>
```

### 2. Update `STATUS.md`
- Move completed items from "In progress" / "Next" to "Done"
- Add new "Next" items if scope shifted
- Update "Last updated" stamp at top
- Update the **🎯 current goal** if we hit it

### 3. Overwrite `HANDOFF.md`
Use the template at the top of `HANDOFF.md` itself. Be concrete about:
- What I worked on
- What's running / broken
- What the next session should do FIRST
- Open questions for the founder

---

## 🚨 Rules that have no exceptions

1. **No commit without a changelog entry.** Even tiny tweaks.
2. **No new external dependency without logging it in `DECISIONS.md`.**
3. **No new secret/env var without adding it to `.env.example` AND `docs/ops/SECRETS_AND_KEYS.md`.**
4. **No manual task assumption.** If we need the founder to do something, it goes in `MANUAL_TASKS.md` as a numbered MT and is announced in chat.
5. **No "TODO" comments in code without a corresponding `STATUS.md` line.** TODOs in code go stale; STATUS.md doesn't.

---

## 🪞 Friday reflection (optional weekly)

Every 5-ish sessions, add a "## Reflection — YYYY-MM-DD" block to `STATUS.md`:
- What's working?
- What's blocked longer than expected?
- What did we learn we should write down in `DECISIONS.md`?

---

## ✨ The why

We don't do these rituals because docs are fun. We do them because:
- The founder may not be present every session
- A new collaborator might join
- A new AI session has zero memory of the last one
- Investors will ask "what's the state?" and we want to answer in 5 seconds, not 5 hours

Sasa is **a multi-year project**. The ritual is the only thing that compounds across sessions.
