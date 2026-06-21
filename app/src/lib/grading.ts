/**
 * Sandbox grading logic.
 *
 * Each exercise type gets its own system prompt that enforces the Sasa voice:
 *  1. Cite the relevant NCDC construct descriptor FIRST, in quotes
 *  2. Compare teacher's response gently
 *  3. Speak as a colleague, never a judge
 *  4. NEVER use "wrong" / "incorrect" / "mistake"
 *  5. Max 4 sentences
 *  6. End with one concrete nuance to consider
 *
 * If the AI call fails, we return a citation-first stand-in so the teacher
 * never sees an error in the middle of their flow.
 */

import "server-only";
import { complete, type AiMessage } from "./ai";
import type { SandboxExercise, SandboxExerciseType, Construct } from "./content/types";

export type Grade = "A" | "B" | "C" | "D" | "E";
export type ConstructKey = "knowledge" | "skill" | "application" | "values";

export type GradeRequest = {
  exercise: SandboxExercise;
  updateTitle: string;
  // For regrade type only:
  grades?: Record<ConstructKey, Grade>;
  // For free-text exercises:
  response?: string;
};

export type GradeResult = {
  feedback: string;
  citationDescriptor: string; // the construct rubric descriptor we cited
  source: "ai" | "fallback";
  ms?: number;
  warning?: string; // present when we fell back
};

// ─────────────────────────────────────────────────────────────
// Public entry
// ─────────────────────────────────────────────────────────────

export async function gradeSubmission(req: GradeRequest): Promise<GradeResult> {
  const messages = buildPrompt(req);
  const result = await complete(messages, { maxTokens: 280, temperature: 0.4 });

  // Pick the descriptor most relevant to this exercise type for citation
  // (Application descriptor is the most user-context-rich; fall back to others if missing.)
  const citationDescriptor =
    req.exercise.rubric.application.descriptor ||
    req.exercise.rubric.knowledge.descriptor ||
    "(no descriptor available)";

  if (result.ok && isWellFormed(result.text)) {
    return {
      feedback: result.text,
      citationDescriptor,
      source: "ai",
      ms: result.ms,
    };
  }

  // Graceful fallback. Teacher sees a calm citation-first stand-in.
  return {
    feedback: fallbackFeedback(req, citationDescriptor),
    citationDescriptor,
    source: "fallback",
    warning: result.ok ? "AI response failed validation" : result.error,
  };
}

// ─────────────────────────────────────────────────────────────
// Prompts
// ─────────────────────────────────────────────────────────────

function buildPrompt(req: GradeRequest): AiMessage[] {
  const { exercise } = req;
  const systemPrompt = baseSystemPrompt(exercise.type);
  const userPrompt = buildUserPrompt(req);

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

const VOICE_RULES = `
You are a senior NCDC curriculum specialist reviewing a Ugandan secondary-school teacher's submission in the Sasa app.

Your job is to:
1. ALWAYS cite the most relevant official construct descriptor first, in quotes, verbatim from the rubric provided.
2. Then gently compare the teacher's response to that descriptor.
3. Speak as a respected colleague, never as a judge.
4. NEVER use the words "wrong", "incorrect", or "mistake".
5. Keep the entire response to a maximum of 4 sentences.
6. End with ONE concrete nuance for the teacher to consider next time.

Tone: warm, professional, Ugandan-English, no Americanisms, no exclamation marks, no emojis. The teacher is a colleague who is doing real work, not a student being judged.
`.trim();

function baseSystemPrompt(type: SandboxExerciseType): string {
  const typeContext: Record<SandboxExerciseType, string> = {
    regrade: "The teacher applied an A-E grade across four constructs (Knowledge, Skill, Application, Values) to a real student response. Comment on whether their grading aligns with the construct descriptors.",
    rewrite: "The teacher rewrote an old-curriculum question to fit the competency-based curriculum. Comment on whether their rewrite tests the constructs they claim to be testing.",
    plan_opener: "The teacher planned a 5-minute lesson opener that should introduce a curriculum concept while assessing all four constructs. Comment on whether the plan would actually achieve that.",
    design_aoi: "The teacher designed an Activity of Integration (AOI). Comment on whether it integrates the four constructs in a real-world Ugandan context.",
    identify_construct: "The teacher identified which construct(s) a given question tests. Comment on whether their identification is well-reasoned against the rubric.",
  };
  return `${VOICE_RULES}\n\n${typeContext[type]}`;
}

function buildUserPrompt(req: GradeRequest): string {
  const { exercise, updateTitle } = req;
  const rubric = exercise.rubric;

  const rubricText = `
RUBRIC (the official construct descriptors for this exercise):
- Knowledge (${rubric.knowledge.weight}%): "${rubric.knowledge.descriptor}"
- Skill (${rubric.skill.weight}%): "${rubric.skill.descriptor}"
- Application (${rubric.application.weight}%): "${rubric.application.descriptor}"
- Values (${rubric.values.weight}%): "${rubric.values.descriptor}"
`.trim();

  const exerciseText = `
EXERCISE CONTEXT:
- Update: "${updateTitle}"
- Exercise type: ${exercise.type}
- Prompt given to teacher: ${exercise.prompt.trim()}
${exercise.reference ? `- Reference material shown to teacher: "${exercise.reference.trim()}"` : ""}
`.trim();

  let submissionText: string;
  if (exercise.type === "regrade" && req.grades) {
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

  return [exerciseText, rubricText, submissionText, "\nWrite your feedback now, following the 6 rules. Maximum 4 sentences."].join("\n\n");
}

// ─────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────

const FORBIDDEN = ["wrong", "incorrect", "mistake"];

function isWellFormed(text: string): boolean {
  if (!text || text.length < 30) return false;
  const lower = text.toLowerCase();
  // Reject if it violates the voice rules
  for (const word of FORBIDDEN) {
    // word-boundary check so we don't reject "wrongdoing" inside a constructive critique etc.
    const re = new RegExp(`\\b${word}\\b`, "i");
    if (re.test(lower)) return false;
  }
  return true;
}

// ─────────────────────────────────────────────────────────────
// Fallback feedback (citation-first, calm, never errors)
// ─────────────────────────────────────────────────────────────

function fallbackFeedback(req: GradeRequest, descriptor: string): string {
  const intro = `NCDC says: "${descriptor}"`;
  const body = req.exercise.type === "regrade"
    ? "Your grades have been recorded. The grading system here is set up to compare your alignment against this descriptor in detail; if you find your scoring varies a lot from a colleague's, the descriptor is the source of truth to return to."
    : "Your response has been recorded. The detailed review system would normally compare your specific answer against this descriptor and highlight where alignment is strong and where there's a gap to close.";
  return `${intro} ${body}`;
}
