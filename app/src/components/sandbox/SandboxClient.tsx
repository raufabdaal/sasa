"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, BookMarked } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SandboxExercise } from "@/lib/content/types";

type Grade = "A" | "B" | "C" | "D" | "E";
const GRADES: Grade[] = ["A", "B", "C", "D", "E"];

/**
 * Interactive Sandbox flow (v2 — DEV-003 fix).
 *
 * Click-through. No AI yet (Phase D). Submit shows pre-written feedback
 * that matches the citation-first voice we want from Claude.
 */
export function SandboxClient({ exercises }: { exercises: SandboxExercise[] }) {
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
        isLast={step === exercises.length - 1}
        onNext={() => setStep((s) => s + 1)}
      />
    </>
  );
}

/**
 * Free-polish completion moment.
 *
 * Gold pulse, single Check, "Added to your Ledger", then a clear next-step CTA.
 * No confetti (forbidden in design philosophy).
 * The single pulse fires once on mount; nothing repeats.
 */
function CompletionCelebration() {
  const [pulsed, setPulsed] = useState(false);

  useEffect(() => {
    // Trigger pulse on next paint
    const t = window.setTimeout(() => setPulsed(true), 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="card p-8 lg:p-10 text-center relative overflow-hidden">
      {/* Gold halo pulse */}
      <div
        aria-hidden
        className={cn(
          "absolute top-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full pointer-events-none",
          "transition-all duration-700 ease-out",
          pulsed ? "scale-[3] opacity-0" : "scale-100 opacity-100",
        )}
        style={{ background: "var(--gold-bright)" }}
      />

      {/* Check mark */}
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

function ExerciseRunner({
  exercise,
  isLast,
  onNext,
}: {
  exercise: SandboxExercise;
  isLast: boolean;
  onNext: () => void;
}) {
  const [grades, setGrades] = useState<Record<string, Grade | null>>({
    knowledge: null, skill: null, application: null, values: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const allGraded = Object.values(grades).every((g) => g !== null);

  const handleSubmit = () => setSubmitted(true);

  const typeName: Record<string, string> = {
    regrade:           "Re-grade",
    rewrite:           "Re-write",
    plan_opener:       "Plan an opener",
    design_aoi:        "Design an AOI",
    identify_construct:"Identify the construct",
  };

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-[10.5px] font-mono tracking-[0.16em] uppercase text-ink-3">
          {typeName[exercise.type] ?? exercise.type}
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
          <div className="text-[10.5px] font-mono tracking-[0.16em] uppercase text-ink-3 mb-2">
            Student response
          </div>
          <p className="font-serif italic text-[15.5px] leading-[1.55] text-ink">
            "{exercise.reference}"
          </p>
        </div>
      )}

      {exercise.type === "regrade" && (
        <>
          <h3 className="font-serif text-[18px] font-medium text-ink mb-3 mt-6">
            Grade each construct
          </h3>

          {(["knowledge", "skill", "application", "values"] as const).map((k) => {
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
                        onClick={() => setGrades((s) => ({ ...s, [k]: g }))}
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

          {!submitted && (
            <button
              type="button"
              disabled={!allGraded}
              onClick={handleSubmit}
              className={cn(
                "btn btn-primary w-full mt-7",
                !allGraded && "opacity-50 cursor-not-allowed",
              )}
            >
              Submit grade
            </button>
          )}

          {submitted && (
            <Feedback grades={grades} exercise={exercise} onNext={onNext} isLast={isLast} />
          )}
        </>
      )}

      {exercise.type !== "regrade" && (
        <>
          <h3 className="font-serif text-[18px] font-medium text-ink mb-3 mt-6">
            Your response
          </h3>
          <textarea
            disabled={submitted}
            placeholder="Write your answer here…"
            className="w-full rounded-2xl p-4 font-serif text-[16px] leading-[1.6] text-ink bg-paper resize-none outline-none focus:ring-2 focus:ring-peach disabled:opacity-60"
            style={{
              border: "0.5px solid var(--line)",
              minHeight: 180,
            }}
          />
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary w-full mt-5"
            >
              Submit
            </button>
          ) : (
            <Feedback grades={null} exercise={exercise} onNext={onNext} isLast={isLast} />
          )}
        </>
      )}
    </div>
  );
}

function Feedback({
  grades,
  exercise,
  onNext,
  isLast,
}: {
  grades: Record<string, Grade | null> | null;
  exercise: SandboxExercise;
  onNext: () => void;
  isLast: boolean;
}) {
  // Pre-written stand-in feedback (real AI in Phase D).
  // Voice rule: cite descriptor first, never say "wrong."
  const descriptor = exercise.rubric.application.descriptor;

  return (
    <div className="mt-6 p-5 rounded-2xl" style={{ background: "var(--peach-soft)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Check className="h-4 w-4 text-ink" strokeWidth={2.25} />
        <span className="text-[10.5px] font-mono tracking-[0.16em] uppercase text-ink-2">
          Recorded
        </span>
      </div>

      <p className="font-serif text-[15.5px] leading-[1.6] text-ink mb-3">
        NCDC says: <em>"{descriptor}"</em>
      </p>

      <p className="font-serif text-[15.5px] leading-[1.6] text-ink-2 mb-4">
        Your response is in the ballpark of the official descriptor. When the real AI grader is wired up (Phase D), it will compare your specific answer against this descriptor and tell you exactly where the alignment is strong and where there's a gap to close.
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
