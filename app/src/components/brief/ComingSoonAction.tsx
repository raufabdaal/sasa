"use client";

import { useState } from "react";
import { Volume2, Bookmark } from "lucide-react";

/**
 * DEV-014: the speaker icon stays visible because the affordance matters,
 * but tapping it shows a polite Coming Soon toast (no spend on TTS in v0).
 *
 * Same pattern for the bookmark/save icon (Phase F: real save when auth lands).
 */
export function ComingSoonAction({ kind }: { kind: "listen" | "save" }) {
  const [shown, setShown] = useState(false);

  const config = {
    listen: {
      label: "Listen",
      Icon: Volume2,
      toast: "Listening coming soon.",
    },
    save: {
      label: "Save",
      Icon: Bookmark,
      toast: "Saving coming soon.",
    },
  }[kind];

  const Icon = config.Icon;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShown(true);
          window.setTimeout(() => setShown(false), 1800);
        }}
        className="h-9 w-9 grid place-items-center rounded-full hover:bg-cream-2 text-ink-2 active:scale-95 transition-transform"
        aria-label={config.label}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
      </button>

      {shown && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-1/2 -translate-x-1/2 bottom-24 lg:bottom-10 z-50 px-4 py-2.5 rounded-full text-[13.5px] font-medium shadow-lg pointer-events-none"
          style={{
            background: "var(--ink)",
            color: "var(--cream)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          }}
        >
          {config.toast}
        </div>
      )}
    </>
  );
}
