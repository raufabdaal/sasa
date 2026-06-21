# Manual Tasks — Things Only You Can Do

> **The agent can write code, configs, schemas, and documentation. The agent cannot click buttons in third-party dashboards, enter your credit card, or sign legal documents. That's what this list is for.**

Every time a manual task pops up, the agent will:
1. Add it to this list.
2. Tell you about it clearly in chat ("⚠️ I need you to do MT-014").
3. Wait for you to mark it ✅ before continuing (where it blocks progress).

Format: each task has an **ID** (so we can refer to it), a **status**, a **blocker** flag, and **clear instructions**.

---

## Legend
- ⏳ Not started
- 🟡 In progress / awaiting external response
- ✅ Done
- 🚫 Skipped (with reason)
- 🔒 **Blocker** — work stops until this is done
- 💤 **Non-blocker** — nice to have, do when you can

---

## Pre-flight (before we write any code)

### MT-001 · Confirm project name ✅ DONE 2026-06-19
**Decision:** Sticking with **Sasa**.

### MT-002 · Choose package manager ✅ DONE 2026-06-19
**Decision:** **pnpm** (9.15.0 installed user-locally).

### MT-003 · Decide on GitHub repo ✅ DONE 2026-06-19
**Repo:** https://github.com/raufabdaal/sasa.git
Remote configured locally. First commit `2b8dd45` made but **not yet pushed** — see MT-060.

---

## Right now — the only blocker

### MT-060 · Push the first commit to GitHub 🔒
**Status:** ⏳
**Blocker:** Soft — code is committed locally; the next session can resume without this. But every subsequent change should be pushable, and pushing now makes the project a real, browsable repo.
**Estimated time:** 2 minutes.

**Why I can't do this:** The sandbox has no credentials to authenticate against your GitHub account.

**What to do:**

1. Open a terminal on your machine.
2. Clone this workspace down (or pull from the sandbox — easiest is to copy the directory). If the workspace is on a different machine, the path will differ. From wherever the project lives locally:
   ```bash
   cd path/to/sasa
   git log --oneline -1     # should show 2b8dd45
   ```
3. (Optional but recommended) Fix the commit author to be yours:
   ```bash
   git config user.name "Rauf Abdaal"           # or whatever you go by
   git config user.email "your-real@email.com"
   git commit --amend --reset-author --no-edit
   ```
4. Push:
   ```bash
   git push -u origin main
   ```
5. Open https://github.com/raufabdaal/sasa to verify.

If the repo on GitHub isn't empty (e.g., has a default README), do `git pull --rebase origin main` first.

When done, reply "MT-060 done" and I'll mark it ✅.

---

## Phase D — Sandbox AI (FREE PATH, no budget needed)

> **Changed 2026-06-20 (DEV-012):** Anthropic Claude was the original plan but founder has no budget right now. Switched to a Groq + Gemini hybrid that's completely free. Architecture stays pluggable so paid Claude can be a one-line swap later.

### MT-010 · Set up Groq API key 💤
**Status:** ⏳
**Blocker:** Soft. Sandbox uses stand-in feedback today; this key unlocks real AI grading.
**Instructions:** `docs/ops/SECRETS_AND_KEYS.md` § 1.
**Estimated time:** 3 min.
**Cost:** **$0. No credit card required.**

Steps:
1. https://console.groq.com → sign in with Google or GitHub.
2. API Keys → Create API Key → name it `sasa-dev`.
3. Copy the key (starts with `gsk_`).
4. Paste into `.env.local` as `GROQ_API_KEY=gsk_...`.
5. Tell me "Groq key is set" and I'll wire up the grader.

### MT-011 · Set up Google Gemini API key (fallback) 💤
**Status:** ⏳
**Blocker:** Soft. Used as fallback when Groq is rate-limited.
**Instructions:** `docs/ops/SECRETS_AND_KEYS.md` § 1b.
**Estimated time:** 3 min.
**Cost:** **$0. No credit card required.**

Steps:
1. https://aistudio.google.com/apikey → sign in with any Google account.
2. Create API key.
3. Paste into `.env.local` as `GEMINI_API_KEY=...`.

---

## Phase F — Auth & Database (DEFERRED, v0 has no auth)

> **Changed 2026-06-20 (DEV-013):** v0 ships with NO authentication. Profile data lives in browser localStorage. These tasks become relevant only when building Phase F.

### MT-020 · Set up Clerk (DEFERRED) 💤
**Status:** ⏳ (not blocking anything in v0)
**Instructions:** `docs/ops/SECRETS_AND_KEYS.md` § 2.
**Estimated time:** 15 min.
**Cost:** **FREE** up to 10,000 monthly active users (email-only). Skip SMS to stay free.
**Note:** When you do enable it, use email-only sign-in (skip SMS which costs per-message).

### MT-021 · Set up Neon Postgres 🔒
**Status:** ⏳
**Instructions:** `docs/ops/SECRETS_AND_KEYS.md` § 3.
**Estimated time:** 5 min.
**Note:** Pick `AWS eu-central-1 (Frankfurt)` for the region.

### MT-022 · Set up Cloudflare R2 🔒
**Status:** ⏳
**Instructions:** `docs/ops/SECRETS_AND_KEYS.md` § 5.
**Estimated time:** 15 min.
**Note:** You'll need to add a payment method to Cloudflare, even though our usage will be free-tier for a long time.

### MT-023 · Set up ElevenLabs (optional in v0) 💤
**Status:** ⏳
**Instructions:** `docs/ops/SECRETS_AND_KEYS.md` § 4.
**Skip if:** you want to ship v0 without audio. We can add a text-only mode and enable audio later.

---

## Phase H — Deploy 🔒

### MT-030 · Vercel signup + project import 🔒
**Status:** ⏳
**Instructions:** `docs/ops/SECRETS_AND_KEYS.md` § 6.
**Pre-req:** GitHub repo (MT-003) must exist.

### MT-031 · Buy domain 🔒
**Status:** ⏳
**Instructions:** `docs/ops/SECRETS_AND_KEYS.md` § 8.
**Pre-req:** Confirm name (MT-001).
**Estimated time:** 30 min + DNS propagation wait.

### MT-032 · Add env vars to Vercel 🔒
**Status:** ⏳
**Instructions:** In the Vercel project dashboard → Settings → Environment Variables → paste each from `.env.local`. **Do this only after MT-030 is done.**

---

## Content & legal (do before launch)

### MT-040 · Source NCDC + UNEB official documents 🟡
**Status:** ⏳
**Why:** For the admin ingest pipeline (Phase 2 ingestion) and for the 25 seed Briefs.
**How:**
1. Visit **https://ncdc.go.ug** and download all 2024–2026 circulars / syllabi as PDFs.
2. Visit **https://uneb.ac.ug** and download recent circulars + sample papers.
3. Save them in `content/source-docs/` in our repo (we'll create this folder).
4. Tell me the list — I'll process them.

### MT-041 · Reach out to NCDC for partnership conversation 💤
**Status:** ⏳
**Why:** Long-term legitimacy (Phase 4 of data architecture).
**Suggested approach:** Email the NCDC Public Relations or Director's office. Short letter: "We've built a digital companion to your retooling efforts. Would love 30 minutes to demo." Do this **after** we have a polished v0 to show.

### MT-042 · Draft Terms of Service & Privacy Policy 🔒
**Status:** ⏳
**Why:** Required before collecting any teacher data.
**How:** Either:
- Use a generator (e.g., **Termly**) and customize for Uganda.
- Or hire a Ugandan lawyer (~UGX 500k for both docs). Recommended — Uganda's Data Protection and Privacy Act (2019) has specific requirements.

### MT-043 · Register with Uganda's Personal Data Protection Office 🔒
**Status:** ⏳
**When:** Before public launch.
**Where:** **https://pdpo.go.ug**
**Why:** Legally required to collect personal data in Uganda.

---

## Growth & operations (post-launch)

### MT-050 · Set up founder email + ops email 💤
**Status:** ⏳
**Suggestion:** Use Google Workspace. `you@sasa.ug` and `hello@sasa.ug`. ~$6/user/month.

### MT-051 · WhatsApp Business account 💤
**Status:** ⏳
**Why:** For teacher support + notifications (the WhatsApp delivery feature in PRD §6).

### MT-052 · First-school partnership conversation 💤
**Status:** ⏳
**Suggestion:** Pick one private school you have a relationship with. Offer 6 months free for 5 teachers in exchange for weekly feedback.

---

## Done so far

*(Move tasks here as they complete, with the date.)*

*(Nothing yet.)*

---

## How tasks get added here

When the agent encounters something it can't do alone, it will:
1. **Add a new MT-### entry above.** Numbered sequentially.
2. **Mark it 🔒 or 💤.**
3. **In chat, say:** *"⚠️ I added MT-014. It blocks Phase X. Please do it when you can."*
4. **Update `STATUS.md`** → "Blocked" section if it's a blocker.

When you complete a task:
1. **Reply in chat:** "MT-014 done."
2. The agent will mark it ✅ here with the date and resume.
