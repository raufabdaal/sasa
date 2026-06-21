import { TopBar } from "@/components/shell/TopBar";
import { SubjectChip } from "@/components/ui/SubjectChip";
import { ChevronRight } from "lucide-react";

/**
 * Me / Profile (DEV-003 + DEV-007 + DEV-009).
 *
 * v2.1: dropped aspirational settings (no auth yet, no notification system,
 * no About page). Honest "Coming soon" for what's actively planned.
 */
export default function MePage() {
  return (
    <>
      <div className="lg:hidden">
        <TopBar center="Profile" />
      </div>

      <div className="px-5 lg:px-10 pt-6 lg:pt-12 pb-12 max-w-[680px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-10">
          <div
            className="h-20 w-20 lg:h-24 lg:w-24 rounded-full mx-auto mb-4 grid place-items-center font-serif text-[32px] lg:text-[38px] font-medium text-ink"
            style={{ background: "var(--cream-3)" }}
          >
            N
          </div>
          <h1 className="font-serif text-[24px] lg:text-[28px] leading-[1.15] font-medium text-ink tracking-[-0.01em]">
            Nakato Sarah
          </h1>
          <p className="text-[14px] text-ink-3 mt-1.5">
            St. Mary's College Kisubi · Wakiso District
          </p>
        </div>

        {/* What I teach */}
        <div className="card p-5 lg:p-6 mb-5">
          <div className="text-[10.5px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold mb-3">
            What I teach
          </div>
          <div className="flex flex-wrap gap-2">
            <SubjectChip subject="Chemistry" grade="S2-S4" />
            <SubjectChip subject="Biology" grade="S2-S4" />
          </div>
        </div>

        {/* Settings — only what's real (DEV-009) */}
        <ul className="card overflow-hidden">
          <SettingRow label="Subjects & grades" />
          <SettingRow label="Greeting language" hint="Luganda" />
          <SettingRow label="Sign out" last />
        </ul>

        {/* Honest "coming soon" group, visually separated */}
        <div className="mt-7">
          <p className="text-[10.5px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold mb-3 px-1">
            Coming soon
          </p>
          <ul className="card overflow-hidden opacity-70">
            <SettingRow label="Download for offline" hint="Phase F" disabled />
            <SettingRow label="Notifications" hint="Phase F" disabled />
            <SettingRow label="Export Retooling Passport" hint="Phase E" disabled last />
          </ul>
        </div>

        <p className="font-serif italic text-[13px] text-ink-3 text-center mt-7">
          Sasa v0.3 · Live · Built in Kampala
        </p>
      </div>
    </>
  );
}

function SettingRow({
  label, hint, last, disabled,
}: { label: string; hint?: string; last?: boolean; disabled?: boolean }) {
  return (
    <li
      className={`flex items-center justify-between px-5 py-3.5 ${disabled ? "" : "active:bg-cream-2 cursor-pointer"}`}
      style={!last ? { borderBottom: "0.5px solid var(--line)" } : {}}
    >
      <span className="text-[15.5px] text-ink font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {hint && <span className="text-[12.5px] text-ink-3">{hint}</span>}
        {!disabled && <ChevronRight className="h-4 w-4 text-ink-3" strokeWidth={1.5} />}
      </div>
    </li>
  );
}
