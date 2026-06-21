import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { TopBar } from "@/components/shell/TopBar";
import { SubjectChip } from "@/components/ui/SubjectChip";
import { getAllUpdates } from "@/lib/content/loader";

/**
 * Sandbox tab — recommended + grid (DEV-003 + DEV-007).
 */
export default function SandboxIndexPage() {
  const updates = getAllUpdates();
  const recommended = updates[0];
  const more = updates.slice(1);

  return (
    <>
      <div className="lg:hidden">
        <TopBar center="Sandbox" />
      </div>

      <div className="px-5 lg:px-10 pt-6 lg:pt-12 pb-12 max-w-[1200px] mx-auto">
        <div className="mb-7 lg:mb-10">
          <p className="text-[13px] font-mono tracking-[0.14em] uppercase text-ink-3 font-semibold mb-2 hidden lg:block">
            Practice
          </p>
          <h1 className="font-serif text-[28px] lg:text-[40px] leading-[1.1] font-medium text-ink tracking-[-0.018em] mb-3">
            Practice the new curriculum.
          </h1>
          <p className="font-serif text-[16px] lg:text-[18px] text-ink-2 leading-[1.6] max-w-[58ch]">
            Each Sandbox is 3 short exercises tied to one curriculum change.
            You apply the change to real student work. About 10 minutes.
          </p>
        </div>

        {recommended && (
          <Link
            href={`/feed/${recommended.slug}/sandbox`}
            className="block card p-5 lg:p-8 mb-6 lg:mb-8 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center justify-between mb-3 lg:mb-5">
              <SubjectChip
                subject={recommended.subjects[0]}
                grade={recommended.grades[0]}
              />
              <span className="tag-coral">Start here</span>
            </div>

            <h2 className="font-serif text-[22px] lg:text-[30px] leading-[1.15] font-medium text-ink mb-2 lg:mb-4 tracking-[-0.012em] max-w-[28ch]">
              {recommended.title}
            </h2>
            <p className="text-[14px] lg:text-[16px] text-ink-2 mb-5 lg:mb-6 max-w-[60ch]">
              {recommended.summary}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-[12px] lg:text-[13px] text-ink-3 inline-flex items-center gap-1.5">
                <FlaskConical className="h-3.5 w-3.5" strokeWidth={1.75} />
                {recommended.sandboxExercises.length} exercises
              </span>
              <span className="text-[13px] lg:text-[14px] font-semibold text-ink inline-flex items-center gap-1.5">
                Start
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
            </div>
          </Link>
        )}

        {more.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-4 lg:mb-5 px-1">
              <span className="text-[10.5px] lg:text-[11px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold">
                Or pick another
              </span>
              <span className="flex-1 h-px bg-line" />
            </div>

            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5">
              {more.map((u) => (
                <li key={u.slug}>
                  <Link
                    href={`/feed/${u.slug}/sandbox`}
                    className="block card p-4 lg:p-6 h-full active:scale-[0.99] transition-transform"
                  >
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                      <SubjectChip subject={u.subjects[0]} grade={u.grades[0]} />
                      <span className="text-[11px] text-ink-3">
                        {u.sandboxExercises.length} exercises
                      </span>
                    </div>
                    <h3 className="font-serif text-[17px] lg:text-[20px] leading-[1.25] font-medium text-ink">
                      {u.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
