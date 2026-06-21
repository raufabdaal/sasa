"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, BookMarked, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SandboxExercise, SandboxExerciseType } from "@/lib/content/types";

type Grade = "A" | "B" | "C" | "D" | "E";
type ConstructKey = "knowledge" | "skill" | "application" | "values";

const GRADES: Grade[] = ["A", "B", "C", "D", "E"];

type ApiResult = {
  feedback: string;
  source: "ai" | "fallback";
  citationDescriptor: string;
};

/**
 * Interactive Sandbox flow (Phase D).
 *
 * Now calls the real /api/grade endpoint. Falls back gracefully to
 * citation-first stand-in feedback if the AI is unreachable.
 *
 * Supports all 5 exercise types:
 *  - regrade: 4-construct A-E selector
 *  - rewrite, plan_opener, design_aoi, identify_construct: free-text textarea
 */
export function SandboxClient({
  exercises,
  slug,
}: {
  exercises: SandboxExercise[];
  slug: string;
}) {
  const [step, setStep] = useState(0);
  const ex = exercises[step];

  if (!ex) {
    return <CompletionCelebration />;
  }

  return (
    <>
      <ProgressBar total={exercises.length} current={step} />
      <ExerciseRunner
        key={ex.id}
        exercise={ex}
        slug={slug}
        isLast={step === exercises.length - 1}
        onNext={() => setStep((s) => s + 1)}
      />
    </>
  );
}

/**
 * Free-polish completion moment. Gold pulse + single check + clear next-step.
 * Fires once. Never repeats. No confetti (forbidden in design philosophy).
 */
function CompletionCelebration() {
  const [pulsed, setPulsed] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setPulsed(true), 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="card p-8 lg:p-10 text-center relative overflow-hidden">
      <div
        aria-hidden
        className={cn(
          "absolute top-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full pointer-events-none",
          "transition-all duration-700 ease-out",
          pulsed ? "scale-[3] opacity-0" : "scale-100 opacity-100",
        )}
        style={{ background: "var(--gold-bright)" }}
      />
      <div
        className="relative mx-auto h-16 w-16 rounded-full grid place-items-center mb-5"
        style={{ background: "var(--gold-bright)" }}
      >
        <Check className="h-8 w-8" strokeWidth={2.5} style={{ color: "var(--ink)" }} />
      </div>
      <h2 className="font-serif text-[26px] lg:text-[30px] font-medium text-ink mb-3 tracking-[-0.015em]">
        You're done.
      </h2>
      <p className="font-serif text-[17px] text-ink-2 mb-7 max-w-[36ch] mx-auto leading-[1.55]">
        Added to your Ledger. The next NCDC update will find you when it's ready.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/ledger" className="btn btn-primary inline-flex">
          <BookMarked className="h-4 w-4" strokeWidth={2} />
          See your Ledger
        </Link>
        <Link href="/feed" className="btn btn-secondary inline-flex">
          Back to Feed
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

function ProgressBar({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            i < current
              ? "bg-sage"
              : i === current
                ? "bg-ink"
                : "bg-cream-3",
          )}
        />
      ))}
      <span className="font-mono text-[11px] text-ink-3 ml-2">
        {current + 1}/{total}
      </span>
    </div>
  );
}

const TYPE_NAMES: Record<SandboxExerciseType, string> = {
  regrade:            "Re-grade",
  rewrite:            "Re-write",
  plan_opener:        "Plan an opener",
  design_aoi:         "Design an AOI",
  identify_construct: "Identify the construct",
};

function ExerciseRunner({
  exercise,
  slug,
  isLast,
  onNext,
}: {
  exercise: SandboxExercise;
  slug: string;
  isLast: boolean;
  onNext: () => void;
}) {
  const [grades, setGrades] = useState<Record<ConstructKey, Grade | null>>({
    knowledge: null, skill: null, application: null, values: null,
  });
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isRegrade = exercise.type === "regrade";
  const allGraded = Object.values(grades).every((g) => g !== null);
  const canSubmit = isRegrade ? allGraded : responseText.trim().length > 10;

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const body = isRegrade
      ? { slug, exerciseId: exercise.id, grades }
      : { slug, exerciseId: exercise.id, response: responseText };

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        // Rate limit gets surfaced to the user
        if (data?.code === "rate_limit") {
          setError(data.error);
          setSubmitting(false);
          return;
        }
        // Any other server error: graceful fallback (server already would have
        // returned a fallback). Show whatever we got.
        setSubmitted({
          feedback: data?.feedback ?? "Your answer has been recorded. (We couldn't reach the feedback service just now.)",
          source: "fallback",
          citationDescriptor: data?.citationDescriptor ?? "",
        });
        setSubmitting(false);
        return;
      }

      setSubmitted({
        feedback: data.feedback,
        source: data.source,
        citationDescriptor: data.citationDescriptor,
      });
      setSubmitting(false);
    } catch {
      // Network error: graceful fallback handled client-side
      setSubmitted({
        feedback: 'Your answer has been recorded. We could not reach the feedback service just now, so the detailed comparison against the official descriptor will appear next time you open this exercise.',
        source: "fallback",
        citationDescriptor: exercise.rubric.application.descriptor,
      });
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-[10.5px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold">
          {TYPE_NAMES[exercise.type] ?? exercise.type}
        </span>
        <span className="text-[11px] text-ink-3">~{exercise.estimatedMinutes} min</span>
      </div>

      <div className="card p-5 mb-4">
        <p className="font-serif text-[17px] leading-[1.55] text-ink whitespace-pre-line">
          {exercise.prompt}
        </p>
      </div>

      {exercise.reference && (
        <div
          className="rounded-2xl p-5 mb-5"
          style={{ background: "var(--cream-2)" }}
        >
          <div className="text-[10.5px] font-mono tracking-[0.16em] uppercase text-ink-3 mb-2 font-semibold">
            Student response
          </div>
          <p className="font-serif italic text-[15.5px] leading-[1.55] text-ink">
            "{exercise.reference}"
          </p>
        </div>
      )}

      {/* Submission UI */}
      {isRegrade ? (
        <RegradeUI
          exercise={exercise}
          grades={grades}
          setGrades={setGrades}
          submitted={submitted !== null}
        />
      ) : (
        <FreeTextUI
          value={responseText}
          onChange={setResponseText}
          submitted={submitted !== null}
          placeholder={placeholderFor(exercise.type)}
        />
      )}

      {/* Submit button (hidden after submission, replaced by feedback) */}
      {!submitted && (
        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className={cn(
            "btn btn-primary w-full mt-7",
            (!canSubmit || submitting) && "opacity-50 cursor-not-allowed",
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
              Thinking
            </>
          ) : (
            "Submit"
          )}
        </button>
      )}

      {error && (
        <p className="mt-4 text-[14px] text-clay font-medium">{error}</p>
      )}

      {submitted && (
        <Feedback
          result={submitted}
          onNext={onNext}
          isLast={isLast}
        />
      )}
    </div>
  );
}

function placeholderFor(type: SandboxExerciseType): string {
  switch (type) {
    case "rewrite":            return "Type your re-written question here. Try to test more than just recall.";
    case "plan_opener":        return "Describe your 5-minute opener: the hook, the activity, and the moment of reflection.";
    case "design_aoi":         return "Describe your Activity of Integration. What will learners do, in what real Ugandan context, that tests all four constructs?";
    case "identify_construct": return "Which construct(s) does this primarily test, and why?";
    default:                    return "Write your answer here.";
  }
}

function RegradeUI({
  exercise,
  grades,
  setGrades,
  submitted,
}: {
  exercise: SandboxExercise;
  grades: Record<ConstructKey, Grade | null>;
  setGrades: (g: Record<ConstructKey, Grade | null>) => void;
  submitted: boolean;
}) {
  const constructs: ConstructKey[] = ["knowledge", "skill", "application", "values"];

  return (
    <>
      <h3 className="font-serif text-[18px] font-medium text-ink mb-3 mt-6">
        Grade each construct
      </h3>
      {constructs.map((k) => {
        const r = exercise.rubric[k];
        return (
          <div
            key={k}
            className="flex items-center justify-between py-3"
            style={{ borderBottom: "0.5px solid var(--line)" }}
          >
            <div className="min-w-0">
              <div className="text-[14.5px] font-semibold text-ink capitalize">
                {k}
              </div>
              <div className="text-[11.5px] font-mono text-ink-3 mt-0.5">
                {r.weight}% weight
              </div>
            </div>
            <div className="flex gap-1.5">
              {GRADES.map((g) => {
                const isSel = grades[k] === g;
                return (
                  <button
                    key={g}
                    type="button"
                    disabled={submitted}
                    onClick={() => setGrades({ ...grades, [k]: g })}
                    className={cn(
                      "h-9 w-9 rounded-lg font-mono text-[13px] font-medium transition-all",
                      isSel
                        ? "bg-ink text-cream"
                        : "bg-transparent text-ink-2 hover:bg-cream-2",
                      submitted && !isSel && "opacity-40",
                    )}
                    style={!isSel ? { border: "0.5px solid var(--line)" } : {}}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

function FreeTextUI({
  value,
  onChange,
  submitted,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  submitted: boolean;
  placeholder: string;
}) {
  return (
    <>
      <h3 className="font-serif text-[18px] font-medium text-ink mb-3 mt-6">
        Your response
      </h3>
      <textarea
        disabled={submitted}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl p-4 font-serif text-[16px] leading-[1.6] text-ink bg-paper resize-none outline-none focus:ring-2 focus:ring-coral disabled:opacity-60"
        style={{
          border: "0.5px solid var(--line)",
          minHeight: 180,
        }}
      />
      <p className="mt-2 text-[12px] text-ink-3">
        {value.trim().length < 10 ? "Write at least a sentence or two." : `${value.trim().length} characters`}
      </p>
    </>
  );
}

function Feedback({
  result,
  onNext,
  isLast,
}: {
  result: ApiResult;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div
      className="mt-6 p-5 rounded-2xl"
      style={{
        background: "var(--peach-soft)",
        borderLeft: "4px solid var(--coral)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Check className="h-4 w-4 text-ink" strokeWidth={2.25} />
        <span className="text-[10.5px] font-mono tracking-[0.16em] uppercase text-ink-2 font-semibold">
          {result.source === "ai" ? "Recorded" : "Recorded (offline)"}
        </span>
      </div>

      <p className="font-serif text-[15.5px] leading-[1.6] text-ink mb-4 whitespace-pre-line">
        {result.feedback}
      </p>

      <button
        type="button"
        onClick={onNext}
        className="btn btn-primary w-full"
      >
        {isLast ? "Finish" : "Next exercise"}
        <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}
