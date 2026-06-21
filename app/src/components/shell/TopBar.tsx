"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Sticky liquid-glass top bar.
 * Three modes: home (greeting), back (with center label), plain.
 *
 * Used everywhere a screen needs a bar. Never use a bare <header>.
 */
export function TopBar({
  left,
  center,
  right,
  className,
}: {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "glass sticky top-0 z-40",
        "px-4 h-14 flex items-center justify-between gap-3",
        className,
      )}
    >
      <div className="flex-1 min-w-0 text-[13px] text-ink-2 truncate">{left}</div>
      <div className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-3 truncate">
        {center}
      </div>
      <div className="flex-1 min-w-0 flex justify-end text-[13px] text-ink-2">
        {right}
      </div>
    </header>
  );
}

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center -ml-2 px-2 py-2 text-ink hover:text-ink/80"
      aria-label="Back"
    >
      <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
    </Link>
  );
}
