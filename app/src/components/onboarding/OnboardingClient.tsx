"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/cn";

type Level = "O-Level" | "A-Level" | "Primary";

const SUBJECTS_BY_LEVEL: Record<Level, string[]> = {
  "O-Level":  ["Chemistry", "Biology", "Physics", "Mathematics", "English", "Kiswahili", "History", "Geography", "ICT", "Entrepreneurship", "Religious Education", "Physical Education"],
  "A-Level":  ["Chemistry", "Biology", "Physics", "Mathematics", "Economics", "Geography", "History", "Literature", "ICT", "Sub. Math", "General Paper", "Entrepreneurship"],
  "Primary":  ["English", "Mathematics", "Science", "Social Studies", "Local Language", "Religious Education", "ICT"],
};

const GRADES_BY_LEVEL: Record<Level, string[]> = {
  "O-Level":  ["S1", "S2", "S3", "S4"],
  "A-Level":  ["S5", "S6"],
  "Primary":  ["P1","P2","P3","P4","P5","P6","P7"],
};

const SAMPLE_SCHOOLS = [
  "King's College Budo",
  "Gayaza High School",
  "St. Mary's College Kisubi",
  "Namilyango College",
  "Ntare School",
  "Mt. St. Mary's Namagunga",
  "Trinity College Nabbingo",
  "Kibuli SS",
  "Makerere College School",
  "Mengo SS",
];

const GREETING_LANGS = [
  { code: "lg",  label: "Luganda",     sample: "Wasuze otya" },
  { code: "en",  label: "English",     sample: "Good morning" },
  { code: "run", label: "Runyankole",  sample: "Oraire ota" },
  { code: "luo", label: "Luo",         sample: "Iribo nining" },
  { code: "ate", label: "Ateso",       sample: "Ijaraki" },
];

export function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<Level | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [school, setSchool] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lang, setLang] = useState<string>("lg");

  const totalSteps = 4;

  // DEV-013: persist onboarding result locally and mark "seen" so the root
  // route stops redirecting future visits back here.
  function finishOnboarding() {
    try {
      window.localStorage.setItem(
        "sasa.profile",
        JSON.stringify({ level, subjects, grades, school, firstName, lang }),
      );
      window.localStorage.setItem("sasa.onboarded", "1");
    } catch {
      // ignore (private browsing, etc.)
    }
    router.push("/feed");
  }

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canAdvance = (() => {
    if (step === 0) return level && subjects.length > 0 && grades.length > 0;
    if (step === 1) return school.trim().length > 1;
    if (step === 2) return firstName.trim().length > 1;
    return true;
  })();

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link href="/feed" className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="h-7 w-7 rounded-lg grid place-items-center text-white font-serif text-[15px] font-semibold"
            style={{ background: "var(--coral)" }}
          >
            S
          </span>
          <span className="font-serif text-[20px] font-medium text-ink tracking-[-0.01em]">
            Sasa
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 w-8 rounded-full transition-colors",
                i < step ? "bg-sage" : i === step ? "bg-coral" : "bg-cream-3",
              )}
              style={{
                background: i < step
                  ? "var(--sage)"
                  : i === step
                    ? "var(--coral)"
                    : "var(--cream-3)",
              }}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 lg:px-10 py-8">
        <div className="w-full max-w-[640px]">

          {step === 0 && (
            <Step
              eyebrow="Step 1 of 4"
              title="What do you teach?"
              subtitle="Pick your level, then the subjects and grades. You can change these later."
            >
              <div className="space-y-7">
                {/* Level */}
                <div>
                  <div className="text-[11px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold mb-3">
                    Level
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["O-Level", "A-Level", "Primary"] as Level[]).map((lv) => (
                      <button
                        key={lv}
                        onClick={() => { setLevel(lv); setSubjects([]); setGrades([]); }}
                        className={cn(
                          "px-4 py-2.5 rounded-full text-[14px] font-medium transition-colors",
                          level === lv
                            ? "bg-ink text-cream"
                            : "bg-cream-2 text-ink-2 hover:bg-cream-3",
                        )}
                      >
                        {lv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subjects */}
                {level && (
                  <div>
                    <div className="text-[11px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold mb-3">
                      Subjects you teach
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS_BY_LEVEL[level].map((s) => {
                        const sel = subjects.includes(s);
                        return (
                          <button
                            key={s}
                            onClick={() => setSubjects((cur) =>
                              cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s].slice(0, 6),
                            )}
                            className={cn(
                              "px-3.5 py-2 rounded-full text-[13.5px] font-medium transition-colors",
                              sel
                                ? "bg-ink text-cream"
                                : "bg-cream-2 text-ink-2 hover:bg-cream-3",
                            )}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Grades */}
                {level && subjects.length > 0 && (
                  <div>
                    <div className="text-[11px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold mb-3">
                      Grades / classes
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {GRADES_BY_LEVEL[level].map((g) => {
                        const sel = grades.includes(g);
                        return (
                          <button
                            key={g}
                            onClick={() => setGrades((cur) =>
                              cur.includes(g) ? cur.filter(x => x !== g) : [...cur, g],
                            )}
                            className={cn(
                              "px-3.5 py-2 rounded-full text-[13.5px] font-medium transition-colors",
                              sel
                                ? "bg-ink text-cream"
                                : "bg-cream-2 text-ink-2 hover:bg-cream-3",
                            )}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step
              eyebrow="Step 2 of 4"
              title="Where do you teach?"
              subtitle="Type your school's name. If yours isn't in the list, that's fine. just keep typing."
            >
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. St. Mary's College Kisubi"
                className="w-full text-[19px] lg:text-[22px] font-serif bg-transparent border-b-2 border-line focus:border-coral outline-none py-3 transition-colors"
                style={{ borderBottomColor: school ? "var(--coral)" : "var(--line)" }}
              />
              {school.length > 1 && (
                <div className="mt-5">
                  <div className="text-[11px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold mb-2.5">
                    Or pick one
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_SCHOOLS
                      .filter((s) => s.toLowerCase().includes(school.toLowerCase()))
                      .slice(0, 6)
                      .map((s) => (
                        <button
                          key={s}
                          onClick={() => setSchool(s)}
                          className="px-3.5 py-1.5 rounded-full text-[13px] bg-cream-2 text-ink-2 hover:bg-cream-3"
                        >
                          {s}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </Step>
          )}

          {step === 2 && (
            <Step
              eyebrow="Step 3 of 4"
              title="How should we greet you?"
              subtitle="We'll say hello in your preferred language when you open the app each day."
            >
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                className="w-full text-[19px] lg:text-[22px] font-serif bg-transparent border-b-2 outline-none py-3 transition-colors mb-7"
                style={{ borderBottomColor: firstName ? "var(--coral)" : "var(--line)" }}
              />

              <div className="text-[11px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold mb-3">
                Greeting language
              </div>
              <div className="flex flex-wrap gap-2">
                {GREETING_LANGS.map((g) => (
                  <button
                    key={g.code}
                    onClick={() => setLang(g.code)}
                    className={cn(
                      "px-4 py-2.5 rounded-full text-[14px] font-medium transition-colors",
                      lang === g.code
                        ? "bg-ink text-cream"
                        : "bg-cream-2 text-ink-2 hover:bg-cream-3",
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {firstName && (
                <div
                  className="mt-7 p-4 rounded-xl"
                  style={{ background: "var(--peach-soft)", borderLeft: "4px solid var(--coral)" }}
                >
                  <p className="font-serif text-[17px] text-ink">
                    {GREETING_LANGS.find(g => g.code === lang)?.sample}, <strong>{firstName}</strong>.
                  </p>
                </div>
              )}
            </Step>
          )}

          {step === 3 && (
            <Step
              eyebrow="Step 4 of 4"
              title="You're 6 updates behind."
              subtitle={`We've gathered ${subjects.length > 0 ? subjects.slice(0,2).join(" and ") + " updates " : "updates "}from NCDC and UNEB published since you were last here. Around 38 minutes to fully catch up.`}
            >
              <div className="space-y-3 mt-2">
                <button
                  type="button"
                  onClick={finishOnboarding}
                  className="btn btn-primary w-full"
                >
                  Show me what's new
                  <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                </button>
                <button
                  type="button"
                  onClick={finishOnboarding}
                  className="btn btn-secondary w-full"
                >
                  I'll just browse
                </button>
              </div>

              <p className="font-serif italic text-[14px] text-ink-3 text-center mt-8 max-w-[36ch] mx-auto leading-[1.55]">
                You can change subjects, grades, school, and greeting anytime in Profile.
              </p>
            </Step>
          )}
        </div>
      </main>

      {/* Footer nav */}
      {step < 3 && (
        <footer className="px-6 lg:px-10 py-6 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className={cn(
              "btn btn-ghost",
              step === 0 && "opacity-0 pointer-events-none",
            )}
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back
          </button>

          <button
            onClick={next}
            disabled={!canAdvance}
            className={cn(
              "btn btn-primary",
              !canAdvance && "opacity-50 cursor-not-allowed",
            )}
          >
            Continue
            <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </footer>
      )}
    </div>
  );
}

function Step({
  eyebrow, title, subtitle, children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold mb-3">
        {eyebrow}
      </div>
      <h1 className="font-serif text-[32px] lg:text-[40px] leading-[1.1] font-medium text-ink tracking-[-0.018em] max-w-[18ch] mb-3">
        {title}
      </h1>
      {subtitle && (
        <p className="font-serif text-[16px] lg:text-[17px] text-ink-2 leading-[1.6] max-w-[58ch] mb-8">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
