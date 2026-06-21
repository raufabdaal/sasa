"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, FlaskConical, BookMarked, User } from "lucide-react";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/feed",    label: "Feed",    Icon: Newspaper },
  { href: "/sandbox", label: "Sandbox", Icon: FlaskConical },
  { href: "/ledger",  label: "Ledger",  Icon: BookMarked },
  { href: "/me",      label: "Me",      Icon: User },
] as const;

/**
 * Bottom tab bar (mobile-only — DEV-007).
 * On ≥1024px the SideNav takes over and this hides via `.tabbar-mobile-only`.
 * Active tab: coral icon + coral underline pill.
 */
export function TabBar() {
  const path = usePathname();

  return (
    <nav
      className={cn(
        "tabbar-mobile-only glass-bottom fixed bottom-0 inset-x-0 z-40",
        "pb-[env(safe-area-inset-bottom)]",
      )}
      aria-label="Primary"
    >
      <ul className="mx-auto max-w-md flex items-stretch justify-around px-2 pt-2 pb-2">
        {tabs.map(({ href, label, Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl",
                  "transition-colors",
                  active ? "text-ink" : "text-ink-3 hover:text-ink-2",
                )}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 top-0.5 bottom-0.5 rounded-xl -z-10"
                    style={{ background: "color-mix(in srgb, var(--coral) 18%, transparent)" }}
                  />
                )}
                <Icon
                  className="h-[19px] w-[19px]"
                  strokeWidth={active ? 1.9 : 1.5}
                  style={active ? { color: "var(--coral)" } : {}}
                />
                <span className={cn(
                  "text-[10.5px] tracking-tight",
                  active ? "font-semibold text-ink" : "font-medium",
                )}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
