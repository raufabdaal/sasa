"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, BookMarked, Loader2, Quote } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SandboxExercise, SandboxExerciseType } from "@/lib/content/types";

type Grade = "A" | "B" | "C" | "D" | "E";
type ConstructKey = "knowledge" | "skill" | "application" | "values";
type Alignment = "strong" | "partial" | "weak";

const GRADES: Grade[] = ["A", "B", "C", "D", "E"];

type ConstructFeedback = {
  construct: ConstructKey;
  alignment: Alignment;
  note: string;
};

type StructuredFeedback = {
  citationDescriptor: string;
  citationConstruct: ConstructKey;
  youSaid: string;
  ncdcSays: string;
  theGap: string;
  tryThis: string;
  overallAlignment: Alignment;
  perConstruct?: ConstructFeedback[];
  source: "ai" | "fallback";
};

type SessionSummary = {
  greeting: string;
  strongAreas: string;
  growthAreas: string;
  mondayAction: string;
  source: "ai" | "fallback";
};

type ExerciseRunResult = {
  exerciseType: SandboxExerciseType;
  overallAlignment: Alignment;
  perConstruct?: ConstructFeedback[];
};

/**
 * Sandbox flow (Phase D + structured feedback v2).
 *
 * Each Submit shows a rich "thought-walk" card (You said / NCDC says / The gap / Try this)
 * plus per-construct alignment chips on re-grade exercises.
 *
 * After the last exercise, the celebration screen calls /api/grade?mode=summary
 * and shows a structured session wrap-up.
 */
export function SandboxClient({
  exercises,
  slug,
}: {
  exercises: SandboxExercise[];
  slug: string;
}) {
  const [step, setStep] = useState(0);
  const [runResults, setRunResults] = useState<ExerciseRunResult[]>([]);
  const ex = exercises[step];

  if (!ex) {
    return <SessionWrapup slug={slug} results={runResults} />;
  }

  return (
    <>
      <ProgressBar total={exercises.length} current={step} />
      <ExerciseRunner
        key={ex.id}
        exercise={ex}
        slug={slug}
        isLast={step === exercises.length - 1}
        onComplete={(feedback) => {
          setRunResults((cur) => [
            ...cur,
            {
              exerciseType: ex.type,
              overallAlignment: feedback.overallAlignment,
              perConstruct: feedback.perConstruct,
            },
          ]);
        }}
        onNext={() => setStep((s) => s + 1)}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Session wrap-up screen
// ─────────────────────────────────────────────────────────────

function SessionWrapup({ slug, results }: { slug: string; results: ExerciseRunResult[] }) {
  const [pulsed, setPulsed] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setPulsed(true), 50);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchSummary() {
      try {
        const res = await fetch("/api/grade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "summary",
            slug,
            exerciseResults: results,
          }),
        });
        const data = await res.json();
        if (!cancelled) {
          if (data?.ok && data.summary) {
            setSummary(data.summary);
          } else {
            setSummary(fallbackSummary(results));
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setSummary(fallbackSummary(results));
          setLoading(false);
        }
      }
    }
    fetchSummary();
    return () => {
      cancelled = true;
    };
  }, [slug, results]);

  return (
    <div className="card p-6 lg:p-10 relative overflow-hidden">
      {/* Gold halo pulse, fires once */}
      <div
        aria-hidden
        className={cn(
          "absolute top-6 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full pointer-events-none",
          "transition-all duration-700 ease-out",
          pulsed ? "scale-[3] opacity-0" : "scale-100 opacity-100",
        )}
        style={{ background: "var(--gold-bright)" }}
      />

      <div className="text-center mb-7">
        <div
          className="relative mx-auto h-16 w-16 rounded-full grid place-items-center mb-4"
          style={{ background: "var(--gold-bright)" }}
        >
          <Check className="h-8 w-8" strokeWidth={2.5} style={{ color: "var(--ink)" }} />
        </div>
        <h2 className="font-serif text-[26px] lg:text-[30px] font-medium text-ink mb-2 tracking-[-0.015em]">
          {loading ? "You're done." : summary?.greeting ?? "You're done."}
        </h2>
        <p className="text-[14px] text-ink-3 font-mono uppercase tracking-[0.14em] font-semibold">
          {results.length} {results.length === 1 ? "exercise" : "exercises"} completed
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-6 text-ink-3 text-[14px]">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          Reflecting on your session
        </div>
      ) : summary ? (
        <div className="space-y-4 mb-7">
          <SummarySection
            label="Where you were strong"
            text={summary.strongAreas}
            tint="var(--sage-soft)"
            accent="var(--sage)"
          />
          <SummarySection
            label="Where to grow"
            text={summary.growthAreas}
            tint="var(--peach-soft)"
            accent="var(--peach-deep)"
          />
          <SummarySection
            label="Try this on Monday"
            text={summary.mondayAction}
            tint="var(--cream-2)"
            accent="var(--ink)"
            highlight
          />
        </div>
      ) : null}

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

function SummarySection({
  label, text, tint, accent, highlight,
}: { label: string; text: string; tint: string; accent: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-2xl p-4 lg:p-5"
      style={{
        background: tint,
        borderLeft: highlight ? `4px solid ${accent}` : undefined,
      }}
    >
      <div
        className="font-mono text-[10px] tracking-[0.16em] uppercase font-semibold mb-2"
        style={{ color: accent }}
      >
        {label}
      </div>
      <p className="font-serif text-[16px] leading-[1.55] text-ink">
        {text}
      </p>
    </div>
  );
}

function fallbackSummary(results: ExerciseRunResult[]): SessionSummary {
  const strong = results.filter((r) => r.overallAlignment === "strong").length;
  const weak = results.filter((r) => r.overallAlignment === "weak").length;
  return {
    greeting: "Session complete.",
    strongAreas: strong > weak
      ? "Your grading aligned with the official descriptors more often than not. That's the harder part of the new curriculum."
      : "You completed every exercise in the session, which already puts you ahead of most teachers on this transition.",
    growthAreas: weak > strong
      ? "Several exercises showed gaps between your assessment and the official descriptor. This is the most common adjustment teachers report."
      : "Where alignment was partial, the descriptors are worth a second read before your next assessment.",
    mondayAction: "Pick one of your last term's tests and re-grade a single question using the new construct rubric. Notice what shifts.",
    source: "fallback",
  };
}

// ─────────────────────────────────────────────────────────────
// Progress bar
// ─────────────────────────────────────────────────────────────

function ProgressBar({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            i < current ? "bg-sage" : i === current ? "bg-ink" : "bg-cream-3",
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

// ─────────────────────────────────────────────────────────────
// Exercise runner
// ─────────────────────────────────────────────────────────────

function ExerciseRunner({
  exercise,
  slug,
  isLast,
  onNext,
  onComplete,
}: {
  exercise: SandboxExercise;
  slug: string;
  isLast: boolean;
  onNext: () => void;
  onComplete: (feedback: StructuredFeedback) => void;
}) {
  const [grades, setGrades] = useState<Record<ConstructKey, Grade | null>>({
    knowledge: null, skill: null, application: null, values: null,
  });
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<StructuredFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isRegrade = exercise.type === "regrade";
  const allGraded = Object.values(grades).every((g) => g !== null);
  const canSubmit = isRegrade ? allGraded : responseText.trim().length > 10;

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const body = isRegrade
      ? { mode: "exercise", slug, exerciseId: exercise.id, grades }
      : { mode: "exercise", slug, exerciseId: exercise.id, response: responseText };

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data?.code === "rate_limit") {
          setError(data.error);
          setSubmitting(false);
          return;
        }
        // Server returned an error but we still get a fallback feedback shape
        if (data?.feedback) {
          setFeedback(data.feedback);
          onComplete(data.feedback);
        }
        setSubmitting(false);
        return;
      }

      setFeedback(data.feedback);
      onComplete(data.feedback);
      setSubmitting(false);
    } catch {
      // Network failure: synthesize a fallback locally
      const local: StructuredFeedback = {
        citationDescriptor: exercise.rubric.application.descriptor,
        citationConstruct: "application",
        youSaid: isRegrade ? "Your grades have been recorded." : "Your response has been recorded.",
        ncdcSays: exercise.rubric.application.descriptor,
        theGap: "We could not reach the feedback service just now. The detailed comparison will appear next time you try.",
        tryThis: "Try this exercise again in a moment.",
        overallAlignment: "partial",
        perConstruct: isRegrade ? [
          { construct: "knowledge",   alignment: "partial", note: "Awaiting alignment check." },
          { construct: "skill",       alignment: "partial", note: "Awaiting alignment check." },
          { construct: "application", alignment: "partial", note: "Awaiting alignment check." },
          { construct: "values",      alignment: "partial", note: "Awaiting alignment check." },
        ] : undefined,
        source: "fallback",
      };
      setFeedback(local);
      onComplete(local);
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

      {isRegrade ? (
        <RegradeUI
          exercise={exercise}
          grades={grades}
          setGrades={setGrades}
          submitted={feedback !== null}
        />
      ) : (
        <FreeTextUI
          value={responseText}
          onChange={setResponseText}
          submitted={feedback !== null}
          placeholder={placeholderFor(exercise.type)}
        />
      )}

      {!feedback && (
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

      {feedback && (
        <FeedbackCard
          feedback={feedback}
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
  exercise, grades, setGrades, submitted,
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
              <div className="text-[14.5px] font-semibold text-ink capitalize">{k}</div>
              <div className="text-[11.5px] font-mono text-ink-3 mt-0.5">{r.weight}% weight</div>
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
                      isSel ? "bg-ink text-cream" : "bg-transparent text-ink-2 hover:bg-cream-2",
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
  value, onChange, submitted, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  submitted: boolean;
  placeholder: string;
}) {
  return (
    <>
      <h3 className="font-serif text-[18px] font-medium text-ink mb-3 mt-6">Your response</h3>
      <textarea
        disabled={submitted}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl p-4 font-serif text-[16px] leading-[1.6] text-ink bg-paper resize-none outline-none focus:ring-2 focus:ring-coral disabled:opacity-60"
        style={{ border: "0.5px solid var(--line)", minHeight: 180 }}
      />
      <p className="mt-2 text-[12px] text-ink-3">
        {value.trim().length < 10 ? "Write at least a sentence or two." : `${value.trim().length} characters`}
      </p>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// The new structured "thought-walk" feedback card
// ─────────────────────────────────────────────────────────────

const ALIGNMENT_STYLE: Record<Alignment, { bg: string; accent: string; label: string }> = {
  strong:  { bg: "var(--sage-soft)",  accent: "var(--sage)",       label: "Aligned" },
  partial: { bg: "var(--peach-soft)", accent: "var(--peach-deep)", label: "Partial" },
  weak:    { bg: "var(--cream-2)",    accent: "var(--clay)",       label: "Worth a closer look" },
};

function FeedbackCard({
  feedback, onNext, isLast,
}: {
  feedback: StructuredFeedback;
  onNext: () => void;
  isLast: boolean;
}) {
  const overall = ALIGNMENT_STYLE[feedback.overallAlignment];

  return (
    <div className="mt-6 space-y-4">
      {/* Header strip: overall alignment */}
      <div
        className="rounded-2xl px-5 py-4 flex items-center justify-between gap-3"
        style={{ background: overall.bg, borderLeft: `4px solid ${overall.accent}` }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Check className="h-4 w-4 flex-shrink-0" strokeWidth={2.5} style={{ color: overall.accent }} />
          <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase font-semibold" style={{ color: overall.accent }}>
            {feedback.source === "ai" ? overall.label : `${overall.label} (offline)`}
          </span>
        </div>
        <span className="text-[11px] text-ink-3 font-mono uppercase tracking-[0.1em] flex-shrink-0">
          Construct: {feedback.citationConstruct}
        </span>
      </div>

      {/* Per-construct chips (re-grade only) */}
      {feedback.perConstruct && feedback.perConstruct.length > 0 && (
        <div className="card p-4 lg:p-5">
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-3 font-semibold mb-3">
            Per construct
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {feedback.perConstruct.map((c) => {
              const style = ALIGNMENT_STYLE[c.alignment];
              return (
                <div
                  key={c.construct}
                  className="rounded-xl px-3 py-2.5"
                  style={{ background: style.bg, borderLeft: `3px solid ${style.accent}` }}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-semibold text-[13px] text-ink capitalize">{c.construct}</span>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] font-semibold" style={{ color: style.accent }}>
                      {style.label}
                    </span>
                  </div>
                  <p className="text-[13px] text-ink-2 leading-[1.45]">{c.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NCDC citation */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--paper)", border: "0.5px solid var(--line)" }}
      >
        <div className="flex items-baseline gap-2 mb-2">
          <Quote className="h-3.5 w-3.5 text-ink-3 flex-shrink-0" strokeWidth={2} />
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-3 font-semibold">
            NCDC says
          </span>
        </div>
        <p className="font-serif italic text-[16px] leading-[1.55] text-ink pl-5">
          "{feedback.citationDescriptor}"
        </p>
      </div>

      {/* The thought-walk: You said / The gap / Try this */}
      <div className="grid grid-cols-1 gap-3">
        <WalkRow label="You said" body={feedback.youSaid} />
        <WalkRow label="The gap" body={feedback.theGap} accent="var(--peach-deep)" />
        <WalkRow label="Try this next time" body={feedback.tryThis} accent="var(--ink)" highlight />
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        className="btn btn-primary w-full mt-3"
      >
        {isLast ? "See my session summary" : "Next exercise"}
        <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}

function WalkRow({
  label, body, accent, highlight,
}: { label: string; body: string; accent?: string; highlight?: boolean }) {
  const accentColor = accent ?? "var(--ink-3)";
  return (
    <div
      className="rounded-2xl p-4 lg:p-5"
      style={{
        background: highlight ? "var(--cream-2)" : "var(--paper)",
        border: "0.5px solid var(--line)",
        borderLeft: highlight ? `4px solid ${accentColor}` : `0.5px solid var(--line)`,
      }}
    >
      <div
        className="font-mono text-[10px] tracking-[0.16em] uppercase font-semibold mb-2"
        style={{ color: accentColor }}
      >
        {label}
      </div>
      <p className="font-serif text-[16px] leading-[1.55] text-ink">
        {body}
      </p>
    </div>
  );
}
