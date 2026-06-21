"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Root entry point.
 *
 * v0 (DEV-013): no real auth. Use localStorage to detect first-time visitors
 * and route them through onboarding before they hit the Feed.
 *
 * Phase F: replace with real auth check (Clerk middleware).
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const seen = typeof window !== "undefined"
      ? window.localStorage.getItem("sasa.onboarded")
      : "1";
    router.replace(seen ? "/feed" : "/onboarding");
  }, [router]);

  // Brief loading state. Should flash for less than a heartbeat.
  return (
    <div className="min-h-dvh grid place-items-center bg-cream">
      <div className="text-center">
        <div
          aria-hidden
          className="h-10 w-10 rounded-xl mx-auto mb-4 grid place-items-center text-white font-serif text-[20px] font-semibold"
          style={{ background: "var(--coral)" }}
        >
          S
        </div>
        <p className="font-serif text-[15px] text-ink-2 italic">Opening Sasa</p>
      </div>
    </div>
  );
}
