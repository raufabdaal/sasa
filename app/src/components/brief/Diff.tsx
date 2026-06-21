/**
 * Before/after change block.
 *
 * v2 redesign (DEV-001 fallout): no more git-style red strike + green plus.
 * Now: two clearly-labeled cards side by side. "Before" is muted/faded.
 * "After" is on a soft sage-tinted card (signaling "this is the new state").
 *
 * Reads like a comparison table you'd see in a textbook, not a code review.
 */
export function Diff({
  before,
  after,
}: {
  before?: string | null;
  after: string;
}) {
  return (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        className="rounded-2xl p-4"
        style={{
          background: "var(--cream-2)",
          border: "0.5px solid var(--line)",
        }}
      >
        <div className="text-[10.5px] font-mono tracking-[0.16em] uppercase text-ink-3 mb-2">
          Before
        </div>
        {before ? (
          <pre className="m-0 whitespace-pre-wrap text-[13px] leading-[1.6] text-ink-2 font-mono opacity-75">
            {before}
          </pre>
        ) : (
          <p className="text-[13px] text-ink-3 italic">No prior version</p>
        )}
      </div>

      <div
        className="rounded-2xl p-4"
        style={{
          background: "var(--sage-soft)",
          border: "0.5px solid color-mix(in srgb, var(--sage) 25%, transparent)",
        }}
      >
        <div className="text-[10.5px] font-mono tracking-[0.16em] uppercase mb-2"
             style={{ color: "color-mix(in srgb, var(--sage) 70%, var(--ink))" }}>
          After
        </div>
        <pre className="m-0 whitespace-pre-wrap text-[13px] leading-[1.6] text-ink font-mono">
          {after}
        </pre>
      </div>
    </div>
  );
}
