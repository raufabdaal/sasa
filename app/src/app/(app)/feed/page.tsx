import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TopBar } from "@/components/shell/TopBar";
import { SubjectChip } from "@/components/ui/SubjectChip";
import { getAllUpdates } from "@/lib/content/loader";
import { greeting } from "@/lib/greeting";

/**
 * The Feed (v2.1).
 *
 * Mobile: single column. Recommended card on top, list below.
 * Desktop (≥ lg): recommended card spans 2 columns at top, then 2-col grid.
 * Generous horizontal whitespace on wide screens.
 */
export default function FeedPage() {
  const updates = getAllUpdates();
  const hello = greeting("Nakato", "lg");

  if (updates.length === 0) {
    return (
      <>
        <TopBar
          left={<span className="font-medium">{hello}</span>}
          right={<Avatar />}
        />
        <div className="px-6 py-24 text-center">
          <p className="font-serif text-[20px] text-ink mb-6 max-w-[28ch] mx-auto">
            Nothing new this term. Rest a little.
          </p>
        </div>
      </>
    );
  }

  const [recommended, ...rest] = updates;

  return (
    <>
      {/* Top bar — mobile only; desktop uses the sidebar */}
      <div className="lg:hidden">
        <TopBar
          left={<span className="font-medium text-[14px]">{hello}</span>}
          right={<Avatar />}
        />
      </div>

      <div className="px-4 lg:px-10 pt-4 lg:pt-12 pb-8 max-w-[1200px] mx-auto">
        {/* Desktop greeting hero */}
        <div className="hidden lg:block mb-10">
          <p className="text-[13px] font-mono tracking-[0.14em] uppercase text-ink-3 font-semibold mb-2">
            {hello}
          </p>
          <h1 className="font-serif text-[40px] leading-[1.05] font-medium text-ink tracking-[-0.02em] max-w-[20ch]">
            What's new in the curriculum.
          </h1>
        </div>

        {/* Recommended (top) card */}
        <Link
          href={`/feed/${recommended.slug}`}
          className="block card p-5 lg:p-8 mb-6 lg:mb-8 active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center justify-between mb-3 lg:mb-5">
            <SubjectChip
              subject={recommended.subjects[0]}
              grade={recommended.grades[0]}
            />
            <span className="tag-coral">Start here</span>
          </div>

          <h2 className="font-serif text-[26px] lg:text-[36px] leading-[1.12] font-medium text-ink mb-2 lg:mb-4 tracking-[-0.015em] max-w-[24ch]">
            {recommended.title}
          </h2>
          <p className="text-[15px] lg:text-[17px] leading-[1.55] text-ink-2 mb-5 lg:mb-7 max-w-[60ch]">
            {recommended.summary}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-[12px] lg:text-[13px] text-ink-3">
              {recommended.estimatedReadMinutes} min read · {recommended.source.publisher}
            </div>
            <div className="inline-flex items-center gap-1.5 text-[13px] lg:text-[14px] font-semibold text-ink">
              Read it
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3 mb-4 lg:mb-5 px-1">
          <span className="text-[10.5px] lg:text-[11px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold">
            More this term
          </span>
          <span className="flex-1 h-px bg-line" />
        </div>

        {/* Mobile = stack, desktop = 2-col grid */}
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5">
          {rest.map((u) => {
            const date = new Date(u.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            });
            return (
              <li key={u.slug}>
                <Link
                  href={`/feed/${u.slug}`}
                  className="block card p-4 lg:p-6 h-full active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center justify-between mb-2 lg:mb-3">
                    <SubjectChip subject={u.subjects[0]} grade={u.grades[0]} />
                    <span className="text-[11px] text-ink-3">{date}</span>
                  </div>

                  <h3 className="font-serif text-[18px] lg:text-[21px] leading-[1.22] font-medium text-ink mb-2 tracking-[-0.005em]">
                    {u.title}
                  </h3>
                  <p className="text-[13.5px] lg:text-[14.5px] leading-[1.5] text-ink-2 mb-3 line-clamp-2 lg:line-clamp-3">
                    {u.summary}
                  </p>

                  <div className="text-[11.5px] text-ink-3">
                    {u.estimatedReadMinutes} min · {u.source.publisher}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 text-center">
          <p className="font-serif text-[14px] italic text-ink-3 leading-[1.6]">
            That's everything we have right now.<br />
            We'll let you know when NCDC publishes more.
          </p>
        </div>
      </div>
    </>
  );
}

function Avatar() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-cream-3 text-ink font-serif text-[13px] font-medium"
      style={{ border: "0.5px solid var(--line)" }}
    >
      N
    </span>
  );
}
