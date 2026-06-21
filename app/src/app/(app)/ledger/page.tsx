import Link from "next/link";
import { ArrowRight, BookMarked, Download } from "lucide-react";
import { TopBar } from "@/components/shell/TopBar";
import { getAllUpdates } from "@/lib/content/loader";

/**
 * Ledger tab (DEV-003 + DEV-007).
 *
 * v0: no real progress yet (no auth/DB).
 * Preview rows show what the populated version will look like.
 */
export default function LedgerPage() {
  const recommended = getAllUpdates()[0];

  return (
    <>
      <div className="lg:hidden">
        <TopBar center="Ledger" />
      </div>

      <div className="px-5 lg:px-10 pt-6 lg:pt-12 pb-12 max-w-[1100px] mx-auto">
        <div className="mb-7 lg:mb-10">
          <p className="text-[13px] font-mono tracking-[0.14em] uppercase text-ink-3 font-semibold mb-2 hidden lg:block">
            Your record
          </p>
          <h1 className="font-serif text-[28px] lg:text-[40px] leading-[1.1] font-medium text-ink tracking-[-0.018em] mb-3">
            Your retooling record.
          </h1>
          <p className="font-serif text-[16px] lg:text-[18px] text-ink-2 leading-[1.6] max-w-[58ch]">
            Every Brief you read and Sandbox you complete shows up here, with the date and your alignment score. Export it as a Retooling Passport, a serif typeset PDF you can hand to your head teacher.
          </p>
        </div>

        {/* Preview of populated Ledger */}
        <div className="card p-4 lg:p-7 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 mb-4 lg:mb-5">
            <div className="flex items-center gap-2 min-w-0">
              <BookMarked className="h-4 w-4 text-ink-3 flex-shrink-0" strokeWidth={1.6} />
              <span className="text-[10px] lg:text-[10.5px] font-mono tracking-[0.14em] uppercase text-ink-3 font-semibold truncate">
                Preview
              </span>
            </div>
            <span className="tag-soft flex-shrink-0">Sample</span>
          </div>

          <div className="space-y-2 lg:space-y-3 opacity-60 pointer-events-none">
            <PreviewRow date="14 Jun" title="Construct weights revised. Chemistry" score="92%" />
            <PreviewRow date="07 Jun" title="New AOI design checklist. Biology" score="88%" />
            <PreviewRow date="28 May" title="History & PE topic merge" score="79%" />
          </div>

          {/* Fade overlay so it looks like a "peek" */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{ background: "linear-gradient(to top, var(--paper), transparent)" }}
          />
        </div>

        {recommended && (
          <div className="card p-5 lg:p-7" style={{ background: "var(--coral-soft)", borderColor: "color-mix(in srgb, var(--coral) 25%, transparent)" }}>
            <h2 className="font-serif text-[20px] lg:text-[24px] leading-[1.2] font-medium text-ink mb-2 tracking-[-0.01em]">
              Begin your Ledger.
            </h2>
            <p className="text-[14px] lg:text-[15px] text-ink-2 mb-5">
              Read the latest update. It takes 7 minutes, and your first entry will appear here.
            </p>
            <Link href={`/feed/${recommended.slug}`} className="btn btn-primary inline-flex">
              Read {recommended.subjects[0]} update
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

function PreviewRow({ date, title, score }: { date: string; title: string; score: string }) {
  return (
    <div
      className="flex items-baseline gap-2.5 lg:gap-4 pb-2.5 lg:pb-3"
      style={{ borderBottom: "0.5px solid var(--line)" }}
    >
      <span className="font-mono text-[11px] lg:text-[11.5px] text-ink-3 w-11 lg:w-14 flex-shrink-0">{date}</span>
      <span className="font-serif text-[14px] lg:text-[16px] text-ink flex-1 leading-[1.35] min-w-0">{title}</span>
      <span className="font-mono text-[11px] lg:text-[11.5px] font-semibold flex-shrink-0" style={{ color: "var(--sage)" }}>{score}</span>
    </div>
  );
}
