"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper, FlaskConical, BookMarked, User,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { SubjectChip } from "@/components/ui/SubjectChip";

/**
 * Desktop-only side navigation (DEV-007).
 * Replaces the bottom TabBar at ≥ lg breakpoint.
 * Sticky, glass-treated, brand at top, "What I teach" at the bottom.
 */
export function SideNav() {
  const path = usePathname();

  const tabs = [
    { href: "/feed",    label: "Feed",    Icon: Newspaper,    hint: "What's new" },
    { href: "/sandbox", label: "Sandbox", Icon: FlaskConical, hint: "Practice" },
    { href: "/ledger",  label: "Ledger",  Icon: BookMarked,   hint: "Your record" },
    { href: "/me",      label: "Profile", Icon: User,         hint: "Settings" },
  ] as const;

  return (
    <aside
      className="sidenav-desktop-only glass-side sticky top-0 h-dvh flex flex-col"
      aria-label="Primary navigation"
    >
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <Link href="/feed" className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="h-7 w-7 rounded-lg grid place-items-center text-white font-serif text-[15px] font-semibold"
            style={{ background: "var(--coral)" }}
          >
            S
          </span>
          <span className="font-serif text-[22px] font-medium text-ink tracking-[-0.01em]">
            Sasa
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1">
        <ul className="space-y-1">
          {tabs.map(({ href, label, Icon, hint }) => {
            const active = path === href || path.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl",
                    "transition-colors",
                    active
                      ? "bg-paper text-ink"
                      : "text-ink-2 hover:bg-cream-2 hover:text-ink",
                  )}
                  style={active ? { boxShadow: "0 1px 2px rgba(0,0,0,0.04)" } : {}}
                >
                  <Icon
                    className="h-[18px] w-[18px] flex-shrink-0"
                    strokeWidth={active ? 1.9 : 1.5}
                    style={active ? { color: "var(--coral)" } : {}}
                  />
                  <span className={cn(
                    "text-[14.5px] tracking-tight",
                    active ? "font-semibold" : "font-medium",
                  )}>
                    {label}
                  </span>
                  <span className="ml-auto text-[11px] text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {hint}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* What I teach (footer) */}
      <div className="px-5 pb-6 pt-4">
        <div
          className="rounded-xl p-3.5"
          style={{ background: "color-mix(in srgb, var(--paper) 70%, transparent)", border: "0.5px solid var(--line)" }}
        >
          <div className="text-[10px] font-mono tracking-[0.16em] uppercase text-ink-3 mb-2 font-semibold">
            Nakato · Teaching
          </div>
          <div className="flex flex-wrap gap-1.5">
            <SubjectChip subject="Chemistry" />
            <SubjectChip subject="Biology" />
          </div>
        </div>
      </div>
    </aside>
  );
}
