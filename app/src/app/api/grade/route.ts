/**
 * POST /api/grade
 *
 * Two modes (controlled by the "mode" field in the body):
 *
 * mode = "exercise"  -> grade a single Sandbox submission, returns StructuredFeedback
 *   body: { mode: "exercise", slug, exerciseId, grades?, response? }
 *
 * mode = "summary"   -> summarize the whole session, returns SessionSummary
 *   body: { mode: "summary", slug, exerciseResults: [...] }
 *
 * Returns 429 on rate limit (5 calls/min per IP).
 */

import { NextResponse } from "next/server";
import { getUpdateBySlug } from "@/lib/content/loader";
import {
  gradeSubmission,
  summarizeSession,
  type ConstructKey,
  type Grade,
  type Alignment,
  type ConstructFeedback,
} from "@/lib/grading";
import type { SandboxExerciseType } from "@/lib/content/types";
import { rateLimit, identifierFromRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_GRADES: Grade[] = ["A", "B", "C", "D", "E"];
const VALID_ALIGNMENTS: Alignment[] = ["strong", "partial", "weak"];

export async function POST(req: Request) {
  const id = identifierFromRequest(req);
  const limit = rateLimit(id);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `You've submitted 5 answers in the last minute. Take a breath and try again in ${Math.ceil(limit.resetIn / 1000)} seconds.`,
        code: "rate_limit",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body.", code: "bad_input" },
      { status: 400 },
    );
  }

  const mode = (body as { mode?: string })?.mode ?? "exercise";

  if (mode === "summary") {
    return handleSummary(body);
  }
  return handleExercise(body);
}

// ─────────────────────────────────────────────────────────────
// Exercise grading
// ─────────────────────────────────────────────────────────────

async function handleExercise(body: unknown) {
  const { slug, exerciseId, grades, response } = (body ?? {}) as {
    slug?: string;
    exerciseId?: string;
    grades?: Partial<Record<ConstructKey, Grade>>;
    response?: string;
  };

  if (!slug || !exerciseId) {
    return NextResponse.json(
      { ok: false, error: "Missing slug or exerciseId.", code: "bad_input" },
      { status: 400 },
    );
  }

  const update = getUpdateBySlug(slug);
  if (!update) {
    return NextResponse.json(
      { ok: false, error: "Brief not found.", code: "not_found" },
      { status: 404 },
    );
  }

  const exercise = update.sandboxExercises.find((e) => e.id === exerciseId);
  if (!exercise) {
    return NextResponse.json(
      { ok: false, error: "Exercise not found in this Brief.", code: "not_found" },
      { status: 404 },
    );
  }

  if (exercise.type === "regrade") {
    const keys: ConstructKey[] = ["knowledge", "skill", "application", "values"];
    for (const k of keys) {
      const g = grades?.[k];
      if (!g || !VALID_GRADES.includes(g)) {
        return NextResponse.json(
          { ok: false, error: `Missing or invalid grade for ${k}.`, code: "bad_input" },
          { status: 400 },
        );
      }
    }
  } else if (response !== undefined && typeof response !== "string") {
    return NextResponse.json(
      { ok: false, error: "Response must be a string.", code: "bad_input" },
      { status: 400 },
    );
  }

  const feedback = await gradeSubmission({
    exercise,
    updateTitle: update.title,
    grades: grades as Record<ConstructKey, Grade> | undefined,
    response,
  });

  return NextResponse.json({ ok: true, mode: "exercise", feedback });
}

// ─────────────────────────────────────────────────────────────
// Session summary
// ─────────────────────────────────────────────────────────────

async function handleSummary(body: unknown) {
  const { slug, exerciseResults } = (body ?? {}) as {
    slug?: string;
    exerciseResults?: Array<{
      exerciseType?: string;
      overallAlignment?: string;
      perConstruct?: ConstructFeedback[];
    }>;
  };

  if (!slug || !Array.isArray(exerciseResults) || exerciseResults.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Missing slug or exerciseResults.", code: "bad_input" },
      { status: 400 },
    );
  }

  const update = getUpdateBySlug(slug);
  if (!update) {
    return NextResponse.json(
      { ok: false, error: "Brief not found.", code: "not_found" },
      { status: 404 },
    );
  }

  // Validate alignments
  for (const r of exerciseResults) {
    if (!r.exerciseType || !r.overallAlignment) {
      return NextResponse.json(
        { ok: false, error: "Each exerciseResult needs exerciseType and overallAlignment.", code: "bad_input" },
        { status: 400 },
      );
    }
    if (!VALID_ALIGNMENTS.includes(r.overallAlignment as Alignment)) {
      return NextResponse.json(
        { ok: false, error: "Invalid alignment value.", code: "bad_input" },
        { status: 400 },
      );
    }
  }

  const summary = await summarizeSession({
    updateTitle: update.title,
    exerciseResults: exerciseResults as Array<{
      exerciseType: SandboxExerciseType;
      overallAlignment: Alignment;
      perConstruct?: ConstructFeedback[];
    }>,
  });

  return NextResponse.json({ ok: true, mode: "summary", summary });
}
