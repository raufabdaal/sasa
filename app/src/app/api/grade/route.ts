/**
 * POST /api/grade
 *
 * Body shape (JSON):
 * {
 *   slug: string,           // the Brief slug, so we can look up the exercise
 *   exerciseId: string,     // which exercise within the Brief
 *   grades?: { knowledge: "A"|...|"E", skill: ..., application: ..., values: ... },
 *   response?: string,      // for free-text exercise types
 * }
 *
 * Returns:
 * {
 *   ok: true,
 *   feedback: string,
 *   source: "ai" | "fallback",
 *   citationDescriptor: string,
 * }
 *
 * Or on rate limit / bad input:
 * { ok: false, error: string, code: "rate_limit" | "bad_input" | "not_found" }
 */

import { NextResponse } from "next/server";
import { getUpdateBySlug } from "@/lib/content/loader";
import { gradeSubmission, type ConstructKey, type Grade } from "@/lib/grading";
import { rateLimit, identifierFromRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_GRADES: Grade[] = ["A", "B", "C", "D", "E"];

export async function POST(req: Request) {
  // Rate limit
  const id = identifierFromRequest(req);
  const limit = rateLimit(id);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `You've submitted ${5} answers in the last minute. Take a breath and try again in ${Math.ceil(limit.resetIn / 1000)} seconds.`,
        code: "rate_limit",
      },
      { status: 429 },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body.", code: "bad_input" },
      { status: 400 },
    );
  }

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

  // Validate grades shape if this is a regrade exercise
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
  } else {
    // Free-text submission. Allow empty (the prompt will note that).
    if (response !== undefined && typeof response !== "string") {
      return NextResponse.json(
        { ok: false, error: "Response must be a string.", code: "bad_input" },
        { status: 400 },
      );
    }
  }

  // Grade
  const result = await gradeSubmission({
    exercise,
    updateTitle: update.title,
    grades: grades as Record<ConstructKey, Grade> | undefined,
    response,
  });

  return NextResponse.json({
    ok: true,
    feedback: result.feedback,
    source: result.source,
    citationDescriptor: result.citationDescriptor,
  });
}
