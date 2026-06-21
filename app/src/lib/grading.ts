/**
 * Sandbox grading logic.
 *
 * Returns STRUCTURED feedback (not a paragraph) so the UI can render it as
 * a thought-walk: "You said / NCDC says / The gap / Try this".
 *
 * For re-grade exercises we also return per-construct alignment (strong,
 * partial, weak) so the UI can show traffic-light chips.
 *
 * Two public entry points:
 *  - gradeSubmission()  for one exercise (after Submit)
 *  - summarizeSession() for the full Sandbox (after the last Submit)
 *
 * Voice rules (enforced in BOTH the system prompt AND a validator):
 *  1. Cite the relevant NCDC construct descriptor verbatim
 *  2. Speak as a colleague, never a judge
 *  3. NEVER use "wrong", "incorrect", "mistake"
 *  4. Each text field is short and human (no walls of text)
 *
 * If the AI fails or returns malformed JSON, we fall back to a calm,
 * citation-first stand-in so the teacher never sees an error mid-flow.
 */

import "server-only";
import { complete, type AiMessage } from "./ai";
import type { SandboxExercise, SandboxExerciseType } from "./content/types";

export type Grade = "A" | "B" | "C" | "D" | "E";
export type ConstructKey = "knowledge" | "skill" | "application" | "values";
export type Alignment = "strong" | "partial" | "weak";

// ─────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────

export type GradeRequest = {
  exercise: SandboxExercise;
  updateTitle: string;
  grades?: Record<ConstructKey, Grade>;   // for re-grade
  response?: string;                       // for free-text
};

export type ConstructFeedback = {
  construct: ConstructKey;
  alignment: Alignment;
  note: string;       // one short sentence
};

export type StructuredFeedback = {
  // Always present
  citationDescriptor: string;          // verbatim NCDC descriptor
  citationConstruct: ConstructKey;     // which construct the citation is from
  youSaid: string;                     // short paraphrase of teacher's submission
  ncdcSays: string;                    // short paraphrase of the descriptor
  theGap: string;                      // 1-2 sentences on the difference
  tryThis: string;                     // ONE concrete next action

  // Only for re-grade: per-construct alignment chips
  perConstruct?: ConstructFeedback[];

  // Meta
  overallAlignment: Alignment;
  source: "ai" | "fallback";
};

export type SessionSummaryRequest = {
  updateTitle: string;
  exerciseResults: Array<{
    exerciseType: SandboxExerciseType;
    overallAlignment: Alignment;
    perConstruct?: ConstructFeedback[];
  }>;
};

export type SessionSummary = {
  greeting: string;        // "You're done." or similar (warm)
  strongAreas: string;     // 1-2 sentences
  growthAreas: string;     // 1-2 sentences
  mondayAction: string;    // ONE concrete thing to try next teaching day
  source: "ai" | "fallback";
};

// ─────────────────────────────────────────────────────────────
// Per-exercise grading
// ─────────────────────────────────────────────────────────────

export async function gradeSubmission(req: GradeRequest): Promise<StructuredFeedback> {
  const messages = buildExercisePrompt(req);
  const result = await complete(messages, { maxTokens: 500, temperature: 0.4 });

  const citation = pickCitation(req);

  if (result.ok) {
    const parsed = parseJsonResponse(result.text);
    if (parsed && validatePerExercise(parsed)) {
      return enrichWithCitation(parsed, citation, "ai");
    }
  }

  // Graceful fallback
  return fallbackPerExercise(req, citation);
}

// ─────────────────────────────────────────────────────────────
// Final session summary
// ─────────────────────────────────────────────────────────────

export async function summarizeSession(req: SessionSummaryRequest): Promise<SessionSummary> {
  const messages = buildSummaryPrompt(req);
  const result = await complete(messages, { maxTokens: 400, temperature: 0.4 });

  if (result.ok) {
    const parsed = parseJsonResponse(result.text);
    if (parsed && validateSummary(parsed)) {
      return {
        greeting: clean(parsed.greeting),
        strongAreas: clean(parsed.strongAreas),
        growthAreas: clean(parsed.growthAreas),
        mondayAction: clean(parsed.mondayAction),
        source: "ai",
      };
    }
  }

  return fallbackSummary(req);
}

// ─────────────────────────────────────────────────────────────
// Prompt construction
// ─────────────────────────────────────────────────────────────

const VOICE_RULES = `
You are a senior NCDC curriculum specialist reviewing a Ugandan secondary-school teacher's submission in the Sasa app.

Your tone: warm, professional, Ugandan-English, no Americanisms, no exclamation marks, no emojis. The teacher is a colleague, not a student. Never use the words "wrong", "incorrect", or "mistake".

You will respond with VALID JSON ONLY. No markdown, no preamble, no code fences. Just the JSON object.
`.trim();

function buildExercisePrompt(req: GradeRequest): AiMessage[] {
  const { exercise } = req;
  const rubric = exercise.rubric;

  const isRegrade = exercise.type === "regrade";

  const schemaInstruction = isRegrade
    ? `
Respond with this exact JSON shape:
{
  "youSaid":  "<one short sentence paraphrasing what the teacher's grades say overall>",
  "ncdcSays": "<one short sentence paraphrasing the relevant rubric expectation>",
  "theGap":   "<one or two sentences describing where alignment is strong and where there's a gap>",
  "tryThis":  "<ONE concrete action the teacher can try next time, max one sentence>",
  "overallAlignment": "strong" | "partial" | "weak",
  "perConstruct": [
    { "construct": "knowledge",   "alignment": "strong"|"partial"|"weak", "note": "<short sentence>" },
    { "construct": "skill",       "alignment": "strong"|"partial"|"weak", "note": "<short sentence>" },
    { "construct": "application", "alignment": "strong"|"partial"|"weak", "note": "<short sentence>" },
    { "construct": "values",      "alignment": "strong"|"partial"|"weak", "note": "<short sentence>" }
  ]
}
`.trim()
    : `
Respond with this exact JSON shape:
{
  "youSaid":  "<one short sentence paraphrasing what the teacher wrote>",
  "ncdcSays": "<one short sentence paraphrasing the most relevant rubric expectation>",
  "theGap":   "<one or two sentences describing where alignment is strong and where there's a gap>",
  "tryThis":  "<ONE concrete action the teacher can try next time, max one sentence>",
  "overallAlignment": "strong" | "partial" | "weak"
}
`.trim();

  const typeContext: Record<SandboxExerciseType, string> = {
    regrade: "The teacher applied A-E grades across the four constructs to a real student response.",
    rewrite: "The teacher rewrote an old-curriculum question to fit the competency-based curriculum.",
    plan_opener: "The teacher planned a 5-minute lesson opener.",
    design_aoi: "The teacher designed an Activity of Integration.",
    identify_construct: "The teacher identified which construct(s) a question tests.",
  };

  const systemPrompt = `${VOICE_RULES}\n\nContext for this exercise: ${typeContext[exercise.type]}\n\n${schemaInstruction}`;

  const rubricText = `
RUBRIC (verbatim from NCDC):
- Knowledge (${rubric.knowledge.weight}%): "${rubric.knowledge.descriptor}"
- Skill (${rubric.skill.weight}%): "${rubric.skill.descriptor}"
- Application (${rubric.application.weight}%): "${rubric.application.descriptor}"
- Values (${rubric.values.weight}%): "${rubric.values.descriptor}"
`.trim();

  const exerciseText = `
EXERCISE:
- Update: "${req.updateTitle}"
- Prompt the teacher saw: ${exercise.prompt.trim()}
${exercise.reference ? `- Reference material: "${exercise.reference.trim()}"` : ""}
`.trim();

  let submissionText: string;
  if (isRegrade && req.grades) {
    submissionText = `
TEACHER'S GRADES:
- Knowledge: ${req.grades.knowledge}
- Skill: ${req.grades.skill}
- Application: ${req.grades.application}
- Values: ${req.grades.values}
`.trim();
  } else {
    submissionText = `TEACHER'S RESPONSE:\n"${(req.response ?? "").trim() || "(empty submission)"}"`;
  }

  return [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: [exerciseText, rubricText, submissionText, "\nReturn the JSON now."].join("\n\n"),
    },
  ];
}

function buildSummaryPrompt(req: SessionSummaryRequest): AiMessage[] {
  const systemPrompt = `${VOICE_RULES}

You are summarizing a complete Sandbox session of ${req.exerciseResults.length} exercises.

Respond with this exact JSON shape:
{
  "greeting":     "<a short warm closing line, 4-7 words. e.g. 'Strong session, Nakato.' or 'Real progress today.'>",
  "strongAreas":  "<one or two sentences naming what the teacher did well across all exercises>",
  "growthAreas":  "<one or two sentences naming where there's room to grow, kindly>",
  "mondayAction": "<ONE concrete thing the teacher can try in their next class, max one sentence>"
}

No "Congratulations" — warm but professional. Never use "wrong", "incorrect", "mistake".`;

  const resultsText = req.exerciseResults
    .map((r, i) => {
      const constructs = r.perConstruct
        ? r.perConstruct.map((c) => `${c.construct}=${c.alignment}`).join(", ")
        : "";
      return `Exercise ${i + 1} (${r.exerciseType}): overall=${r.overallAlignment}${constructs ? `, ${constructs}` : ""}`;
    })
    .join("\n");

  return [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Brief: "${req.updateTitle}"\n\nResults across all exercises in this session:\n${resultsText}\n\nReturn the JSON now.`,
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// Parsing & validation
// ─────────────────────────────────────────────────────────────

const FORBIDDEN = ["wrong", "incorrect", "mistake"];
const ALIGNMENTS = new Set<Alignment>(["strong", "partial", "weak"]);
const CONSTRUCTS = new Set<ConstructKey>(["knowledge", "skill", "application", "values"]);

function parseJsonResponse(text: string): Record<string, unknown> | null {
  // Strip markdown code fences if the model added them despite instructions
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  }
  // Find the first { and last } in case there's any preamble or trailing text
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end < 0 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function hasForbiddenWords(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN.some((w) => new RegExp(`\\b${w}\\b`).test(lower));
}

function validatePerExercise(p: Record<string, unknown>): boolean {
  const required: Array<keyof StructuredFeedback> = ["youSaid", "ncdcSays", "theGap", "tryThis", "overallAlignment"];
  for (const k of required) {
    if (typeof p[k] !== "string" || (p[k] as string).length < 5) return false;
  }
  if (!ALIGNMENTS.has(p.overallAlignment as Alignment)) return false;
  if (hasForbiddenWords([p.youSaid, p.ncdcSays, p.theGap, p.tryThis].join(" "))) return false;

  if ("perConstruct" in p && Array.isArray(p.perConstruct)) {
    for (const c of p.perConstruct as Array<Record<string, unknown>>) {
      if (typeof c.construct !== "string" || !CONSTRUCTS.has(c.construct as ConstructKey)) return false;
      if (!ALIGNMENTS.has(c.alignment as Alignment)) return false;
      if (typeof c.note !== "string" || hasForbiddenWords(c.note)) return false;
    }
  }
  return true;
}

function validateSummary(p: Record<string, unknown>): boolean {
  const required = ["greeting", "strongAreas", "growthAreas", "mondayAction"] as const;
  for (const k of required) {
    if (typeof p[k] !== "string" || (p[k] as string).length < 3) return false;
  }
  return !hasForbiddenWords(required.map((k) => p[k] as string).join(" "));
}

// ─────────────────────────────────────────────────────────────
// Citation pick & enrichment
// ─────────────────────────────────────────────────────────────

function pickCitation(req: GradeRequest): { descriptor: string; construct: ConstructKey } {
  // For free-text types, Application is usually the most context-rich descriptor.
  // For re-grade, find the construct where the teacher's grade is most likely
  // to need NCDC clarification (heuristic: pick Application as default).
  const r = req.exercise.rubric;
  if (req.exercise.type === "regrade" && req.grades) {
    // Pick the construct whose grade is the most extreme (A or E) since those
    // are the ones most worth citing back to.
    const order: ConstructKey[] = ["application", "values", "skill", "knowledge"];
    for (const k of order) {
      if (req.grades[k] === "A" || req.grades[k] === "E") {
        return { descriptor: r[k].descriptor, construct: k };
      }
    }
  }
  return { descriptor: r.application.descriptor || r.knowledge.descriptor || "(no descriptor)", construct: "application" };
}

function enrichWithCitation(
  parsed: Record<string, unknown>,
  citation: { descriptor: string; construct: ConstructKey },
  source: "ai" | "fallback",
): StructuredFeedback {
  return {
    citationDescriptor: citation.descriptor,
    citationConstruct: citation.construct,
    youSaid: clean(parsed.youSaid),
    ncdcSays: clean(parsed.ncdcSays),
    theGap: clean(parsed.theGap),
    tryThis: clean(parsed.tryThis),
    overallAlignment: parsed.overallAlignment as Alignment,
    perConstruct: Array.isArray(parsed.perConstruct)
      ? (parsed.perConstruct as ConstructFeedback[]).map((c) => ({
          construct: c.construct,
          alignment: c.alignment,
          note: clean(c.note),
        }))
      : undefined,
    source,
  };
}

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// ─────────────────────────────────────────────────────────────
// Fallbacks (calm, citation-first, never errors)
// ─────────────────────────────────────────────────────────────

function fallbackPerExercise(req: GradeRequest, citation: { descriptor: string; construct: ConstructKey }): StructuredFeedback {
  const isRegrade = req.exercise.type === "regrade";

  return {
    citationDescriptor: citation.descriptor,
    citationConstruct: citation.construct,
    youSaid: isRegrade
      ? "Your construct grades have been recorded."
      : "Your response has been recorded.",
    ncdcSays: citation.descriptor,
    theGap: "The detailed comparison against the official descriptor needs a fresh AI call. Try the exercise again in a moment.",
    tryThis: "When the comparison is available, look first at whether your response named a specific Ugandan context.",
    overallAlignment: "partial",
    perConstruct: isRegrade
      ? [
          { construct: "knowledge",   alignment: "partial", note: "Awaiting alignment check." },
          { construct: "skill",       alignment: "partial", note: "Awaiting alignment check." },
          { construct: "application", alignment: "partial", note: "Awaiting alignment check." },
          { construct: "values",      alignment: "partial", note: "Awaiting alignment check." },
        ]
      : undefined,
    source: "fallback",
  };
}

function fallbackSummary(req: SessionSummaryRequest): SessionSummary {
  // Look at the alignments and produce something honest without AI.
  const counts = { strong: 0, partial: 0, weak: 0 };
  for (const r of req.exerciseResults) counts[r.overallAlignment]++;

  let strongAreas: string;
  let growthAreas: string;
  if (counts.strong > counts.weak) {
    strongAreas = "Your grading lined up with the official descriptors more often than not, which is the harder part of the new curriculum.";
    growthAreas = "Where the alignment was partial, the descriptors are worth a second read before your next assessment.";
  } else if (counts.weak > counts.strong) {
    growthAreas = "Several exercises showed gaps between your assessment and the official descriptor. This is the most common adjustment teachers report.";
    strongAreas = "You completed the full session, which already puts you ahead of most teachers on the transition.";
  } else {
    strongAreas = "Mixed alignment across the session is typical at this stage of CBC implementation.";
    growthAreas = "The descriptors that came up most often are worth keeping near your lesson planner.";
  }

  return {
    greeting: "Session complete.",
    strongAreas,
    growthAreas,
    mondayAction: "Open one of your last term's tests and re-grade a single question using the new construct rubric. Notice what shifts.",
    source: "fallback",
  };
}
