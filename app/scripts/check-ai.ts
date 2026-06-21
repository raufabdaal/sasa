/**
 * scripts/check-ai.ts
 *
 * Run from the app/ folder:  pnpm exec tsx scripts/check-ai.ts
 * (Or, if you have dotenv installed:  node --env-file=.env.local --import=tsx scripts/check-ai.ts)
 *
 * Tests that your GROQ_API_KEY in .env.local is valid and reachable.
 * Prints either "Groq is reachable" or the exact error so you can debug.
 *
 * Node 20.6+ supports `--env-file` natively. If you're on older Node, this
 * script also tries to parse .env.local by hand.
 */

import { readFileSync, existsSync } from "node:fs";

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // Strip optional quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}

async function main() {
  loadEnvFile(".env.local");

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.error("[FAIL] GROQ_API_KEY is not set.");
    console.error("       Add it to .env.local in the app/ folder, like:");
    console.error("         GROQ_API_KEY=gsk_...");
    process.exit(1);
  }
  console.log("[OK]   GROQ_API_KEY is set");

  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  console.log("       Model:", model);
  console.log("");
  console.log("Sending test prompt to Groq...");

  const started = Date.now();

  let res: Response;
  try {
    res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a brief test responder." },
          { role: "user", content: "Reply with exactly: 'Sasa AI is online.'" },
        ],
        max_tokens: 30,
      }),
    });
  } catch (e) {
    console.error("[FAIL] Network error:", e instanceof Error ? e.message : String(e));
    process.exit(1);
  }

  const ms = Date.now() - started;

  if (!res.ok) {
    console.error(`[FAIL] Groq returned ${res.status} ${res.statusText}`);
    const body = await res.text().catch(() => "");
    if (body) console.error("       Body:", body.slice(0, 300));
    if (res.status === 401 || res.status === 403) {
      console.error("");
      console.error("       Auth failed. Verify your key at https://console.groq.com/keys");
      console.error("       The key in .env.local may be revoked, expired, or mistyped.");
    }
    process.exit(1);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim() ?? "(empty)";

  console.log("");
  console.log(`[OK]   Groq is reachable (${ms}ms)`);
  console.log(`       Response: "${text}"`);
  console.log("");
  console.log("You're ready. Run 'pnpm dev' and try the Sandbox.");
}

main();
