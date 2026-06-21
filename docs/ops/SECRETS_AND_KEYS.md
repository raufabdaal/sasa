# Secrets, API Keys & External Services

> **The complete, step-by-step guide for every key and credential Sasa needs.**
> Each section tells you: **what it is → why we need it → where to click → where to paste it → how to verify it works.**

This document is **safe to commit to git** (it has no secrets, only instructions).
The actual secrets live in `.env.local` (which is gitignored — see `.env.example` for the template).

---

## How to use this doc

- Each service has a **🟢 Required for** label so you know when you'll need it.
- Each has a **⏱ Time** estimate.
- Each has a **💰 Cost** note so there are no surprises.
- Each ends with a **✅ Verify** step.
- If a step requires you to click around in a dashboard, I'll describe it in plain English. If a service's UI changes, the screenshots may not match — the buttons should still be findable.

**If a step ever fails, copy the error and tell me. I'll debug with you.**

---

## Master `.env.local` template

Create this file at the root of the `app/` Next.js project (we'll create it together).
Copy from `.env.example`. Never commit `.env.local`.

```bash
# ─────────────────────────────────────────────────────────────
# Sasa — Local Environment Variables
# ─────────────────────────────────────────────────────────────
# Fill these in as you complete each section of this doc.
# Lines starting with # are comments.
# ─────────────────────────────────────────────────────────────

# === Anthropic (Phase D — Sandbox AI grading) ===
ANTHROPIC_API_KEY=sk-ant-PASTE_HERE

# === Clerk (Phase F — Auth) ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_PASTE_HERE
CLERK_SECRET_KEY=sk_test_PASTE_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/feed
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# === Neon Postgres (Phase F — Database) ===
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require

# === ElevenLabs (Phase F — TTS, optional v0) ===
ELEVENLABS_API_KEY=PASTE_HERE
ELEVENLABS_VOICE_ID=PASTE_HERE   # the Ugandan-English voice id we choose

# === Cloudflare R2 (Phase F — Object storage) ===
R2_ACCOUNT_ID=PASTE_HERE
R2_ACCESS_KEY_ID=PASTE_HERE
R2_SECRET_ACCESS_KEY=PASTE_HERE
R2_BUCKET_NAME=sasa-prod
R2_PUBLIC_URL=https://cdn.sasa.ug   # or the R2.dev URL until custom domain is set up

# === PostHog (Phase F — analytics, optional) ===
NEXT_PUBLIC_POSTHOG_KEY=phc_PASTE_HERE
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# === Internal ===
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 1. Anthropic (Claude) — Sandbox AI grading

| | |
|---|---|
| **🟢 Required for** | Phase D (Sandbox) — earliest |
| **⏱ Time to set up** | 5 minutes |
| **💰 Cost** | Pay-as-you-go. ~$0.10–$0.40 per Sandbox grade. Budget $20 to start. |
| **Free credits?** | $5 trial on signup (sometimes) |

### Steps
1. Go to **https://console.anthropic.com**
2. Sign up (use a permanent founder email, not personal).
3. Top right → **Settings → Billing** → add a payment method. Set a monthly cap of **$50** while developing.
4. Left sidebar → **API Keys** → **Create Key**.
5. Name it `sasa-dev-local`. Copy the key (starts with `sk-ant-`).
6. Paste into `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxx
   ```
7. **Never** paste this into chat or commit it. If you accidentally do, revoke immediately.

### ✅ Verify
After we wire it up, run from the `app/` dir:
```bash
pnpm tsx scripts/check-anthropic.ts
```
(I'll write this script in Phase D. It should print `✓ Claude is reachable`.)

### When to create a second key
Create a separate `sasa-prod` key when we deploy. Never share dev & prod keys.

---

## 2. Clerk — Authentication (DEFERRED, v0 has no auth)

> ⚠️ **v0 (DEV-013) ships with NO authentication.** Profile data lives in localStorage. This section applies only when you're ready for real accounts (Phase F).

| | |
|---|---|
| **🟢 Required for** | Phase F (Auth) only |
| **⏱ Time** | 15 minutes |
| **💰 Cost** | **Free up to 10,000 monthly active users** (email-only). SMS OTP costs ~$0.03/SMS extra; we'll skip SMS for v1 and use email-only sign-in. |

### Steps
1. Go to **https://clerk.com** → Sign up.
2. **Create application** → name it `Sasa`.
3. Authentication strategies — **enable**:
   - ✅ Email + verification code
   - ✅ Phone number + SMS code  ← critical for Uganda
4. Disable everything else (no Google/Apple/etc for v1 — keeps the UX clean).
5. Customize → **Appearance**:
   - We'll override this in code with our own design system, but set the brand color to `#1A1A1A` for the default fallback.
6. Left sidebar → **API Keys**.
7. Copy the two keys:
   - **Publishable key** (starts `pk_test_…`) → goes in `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** (starts `sk_test_…`) → goes in `CLERK_SECRET_KEY`
8. Paste into `.env.local`.

### SMS setup (Uganda-specific) ⚠️
- Clerk uses Twilio under the hood. **Test if Ugandan numbers (+256) deliver before launch.**
- In some plans you must explicitly enable Uganda in Twilio's geo permissions.
- If SMS is unreliable, our fallback is **WhatsApp OTP via Meta Cloud API** — separate setup, decide later (logged as open question in `DECISIONS.md`).

### Webhooks (when we add them later)
- Settings → Webhooks → Add endpoint
- URL: `https://YOUR_DOMAIN/api/webhooks/clerk`
- Subscribe to `user.created`, `user.updated`, `user.deleted`
- **Copy the signing secret** → add to `.env.local` as `CLERK_WEBHOOK_SECRET=...`

### ✅ Verify
After Phase F: visit `localhost:3000/sign-in`, enter your phone, receive an OTP, log in. You should land on `/onboarding`.

---

## 3. Neon — Postgres database

| | |
|---|---|
| **🟢 Required for** | Phase F (DB) |
| **⏱ Time** | 5 minutes |
| **💰 Cost** | Generous free tier (0.5 GB storage, 191 compute hrs/mo). Likely free for first 12 months. |

### Steps
1. Go to **https://neon.tech** → Sign up with GitHub.
2. **Create project** → name `sasa`, region **`AWS eu-central-1` (Frankfurt)** — closest to Uganda with full Neon support.
3. Default database name → `sasa`.
4. After creation, you'll see a **Connection string** like:
   ```
   postgresql://sasa_owner:abc123@ep-cool-name.eu-central-1.aws.neon.tech/sasa?sslmode=require
   ```
5. Click **Show password**, copy the full string.
6. Paste into `.env.local`:
   ```
   DATABASE_URL=postgresql://...
   ```

### Create a separate branch for development
Neon supports git-like DB branches.
1. In Neon dashboard → **Branches** → **Create branch** → name `dev`.
2. Use the `dev` branch connection string for local development.
3. Keep `main` clean for production.

### ✅ Verify
After Phase F:
```bash
cd web && pnpm drizzle-kit push
pnpm tsx scripts/check-db.ts
```
Should print `✓ Connected to Neon. Tables: users, curriculum_updates, user_update_progress`.

---

## 4. ElevenLabs — TTS for Brief audio (optional in v0)

| | |
|---|---|
| **🟢 Required for** | Phase F (audio narration) — skip in v0 if budget is tight |
| **⏱ Time** | 10 minutes |
| **💰 Cost** | Free tier: 10,000 chars/mo. Starter $5/mo: 30,000 chars. Each Brief ≈ 2,000 chars. |

### Steps
1. Go to **https://elevenlabs.io** → Sign up.
2. **Voices → Voice Library** → search for an African-English voice. Filter: *Accent = African*.
3. Audition a few. Pick one. Click **Add to my Voices**.
4. Open the voice → copy the **Voice ID** (long string).
5. **Profile → API Key** → copy.
6. Paste both into `.env.local`:
   ```
   ELEVENLABS_API_KEY=...
   ELEVENLABS_VOICE_ID=...
   ```

### Eventually
We'll record a real Ugandan teacher reading our 200 most-used pedagogical terms, then fine-tune a voice. That's Year 1, not v1.

### ✅ Verify
```bash
pnpm tsx scripts/check-tts.ts
```
Should generate `/tmp/sasa-tts-test.mp3` saying "Wasuze otya, Nakato."

---

## 5. Cloudflare R2 — Object storage (PDFs, audio, uploads)

| | |
|---|---|
| **🟢 Required for** | Phase F |
| **⏱ Time** | 15 minutes (longer if you don't have Cloudflare yet) |
| **💰 Cost** | Free egress (huge for us — many teachers, many downloads). $0.015/GB stored. ~$1/mo at our scale. |

### Steps
1. Go to **https://dash.cloudflare.com** → Sign up if needed.
2. Left sidebar → **R2 Object Storage** → **Enable** (requires adding a payment method, won't be charged at our scale).
3. **Create bucket** → name `sasa-prod` → location `EEUR` (Europe).
4. After creation: **Settings → Public access → Allow public access** (for audio + Passport PDFs).
5. Go to **R2 → Manage R2 API Tokens** → **Create API Token**.
6. Permissions: **Object Read & Write** for `sasa-prod` only.
7. Save the token. You'll see:
   - **Access Key ID**
   - **Secret Access Key**
   - **Account ID** (shown elsewhere in dashboard — right sidebar of any R2 page)
8. Paste into `.env.local`.

### Custom domain (do this later, when launching)
- R2 bucket → **Settings → Custom Domains** → Add `cdn.sasa.ug`
- Cloudflare auto-issues SSL cert. Set `R2_PUBLIC_URL=https://cdn.sasa.ug`.

### ✅ Verify
```bash
pnpm tsx scripts/check-r2.ts
```
Should upload a test text file and print its public URL.

---

## 6. Vercel — Hosting

| | |
|---|---|
| **🟢 Required for** | Phase H (deploy) |
| **⏱ Time** | 10 minutes |
| **💰 Cost** | Free hobby tier covers us until ~100k MAU. Pro = $20/mo if/when needed. |

### Steps
1. Sign up at **https://vercel.com** with GitHub.
2. **Import project** → pick the GitHub repo (we'll create one).
3. Framework auto-detects as **Next.js**.
4. **Environment Variables**: paste every variable from `.env.local` into the Vercel UI. Make sure to mark `NEXT_PUBLIC_*` ones as "available in all environments" and secret ones as "Production + Preview" but **NOT** "Development."
5. Click **Deploy**.

### Custom domain
1. Vercel project → **Settings → Domains** → Add `sasa.ug` and `www.sasa.ug`.
2. Update DNS at your domain registrar (we'll buy `sasa.ug` later — Uganda's `.ug` registry is `registry.co.ug`).

### ✅ Verify
Visit the auto-assigned `.vercel.app` URL. The landing page loads.

---

## 7. PostHog — Analytics (optional, do later)

| | |
|---|---|
| **🟢 Required for** | Whenever you want product insights |
| **⏱ Time** | 5 minutes |
| **💰 Cost** | Free up to 1M events/mo |

### Steps
1. Sign up at **https://posthog.com** → choose **EU Cloud** (data sovereignty).
2. New project → `sasa`.
3. Copy **Project API Key** (starts `phc_`).
4. Paste into `.env.local`.

---

## 8. Domain (`sasa.ug`)

| | |
|---|---|
| **🟢 Required for** | Phase H |
| **⏱ Time** | 30 minutes + waiting for DNS |
| **💰 Cost** | ~UGX 100,000/year for a `.ug` domain |

### Steps
1. Go to **https://registry.co.ug** or a reseller (e.g., **Truehost**, **Hostalite**).
2. Search `sasa.ug`. If taken, alternatives: `sasa.education`, `getsasa.ug`, `sasa.app`.
3. Buy. Use your founder email.
4. Once purchased, point DNS to Vercel:
   - In domain control panel → **Nameservers** → set to:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
   - OR add A/CNAME records as Vercel instructs.
5. Wait 1–24 hours for DNS to propagate.

### ✅ Verify
`dig sasa.ug` shows Vercel IPs.

---

## When you've completed each section

Update `STATUS.md` → "Keys & accounts" table → change ⏳ to ✅ with date.

Then tell me in chat and I'll proceed with the next phase.

---

## If a key leaks

It happens. Stay calm.
1. **Revoke immediately** in the service's dashboard.
2. **Generate a new one.**
3. **Update `.env.local` locally and Vercel.**
4. **Check git history** — if it was committed, force-push removal and consider the repo poisoned (rotate every related secret).
5. **Log in `CHANGELOG.md`** under "Ops" as `Rotated <SERVICE> key (leaked via <how>)`.
