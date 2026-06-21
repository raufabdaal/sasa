/**
 * Sasa AI client (provider-agnostic).
 *
 * Default provider: Groq (Llama 3.3 70B Versatile, free tier).
 * Future providers: Gemini (fallback), Anthropic Claude (paid upgrade).
 *
 * All providers normalize to the same `complete()` signature, so swapping is
 * a single env var change.
 *
 * Required env (set in .env.local locally + Vercel dashboard for production):
 *   GROQ_API_KEY=gsk_...
 *   AI_PROVIDER=groq    (optional, defaults to groq)
 *
 * This file is server-only. Never import from a client component.
 */

import "server-only";

export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiResult =
  | { ok: true; text: string; provider: string; ms: number }
  | { ok: false; error: string; code: "rate_limit" | "auth" | "network" | "other"; provider: string };

const PROVIDER = (process.env.AI_PROVIDER ?? "groq").toLowerCase();
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

/**
 * The single entry point. Pass messages + options, get back a normalized result.
 * Never throws. Always returns a result the caller can branch on.
 */
export async function complete(
  messages: AiMessage[],
  options: { maxTokens?: number; temperature?: number } = {},
): Promise<AiResult> {
  const started = Date.now();

  switch (PROVIDER) {
    case "groq":
      return groqComplete(messages, options, started);
    default:
      return {
        ok: false,
        error: `Unknown AI_PROVIDER: ${PROVIDER}. Supported: groq.`,
        code: "other",
        provider: PROVIDER,
      };
  }
}

async function groqComplete(
  messages: AiMessage[],
  options: { maxTokens?: number; temperature?: number },
  started: number,
): Promise<AiResult> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return {
      ok: false,
      error: "GROQ_API_KEY is not set. Add it to .env.local locally, and to Vercel's project Environment Variables for production.",
      code: "auth",
      provider: "groq",
    };
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        max_tokens: options.maxTokens ?? 350,
        temperature: options.temperature ?? 0.4,
        stream: false,
      }),
    });

    if (res.status === 429) {
      return { ok: false, error: "Groq rate limit reached.", code: "rate_limit", provider: "groq" };
    }
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: "Groq auth failed (invalid or revoked key).", code: "auth", provider: "groq" };
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Groq error ${res.status}: ${body.slice(0, 200)}`,
        code: "other",
        provider: "groq",
      };
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return { ok: false, error: "Groq returned an empty response.", code: "other", provider: "groq" };
    }

    return { ok: true, text, provider: "groq", ms: Date.now() - started };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Network error: ${message}`, code: "network", provider: "groq" };
  }
}
