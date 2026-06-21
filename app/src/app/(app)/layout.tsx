import { TabBar } from "@/components/shell/TabBar";
import { SideNav } from "@/components/shell/SideNav";

/**
 * Authenticated app shell (DEV-007 — responsive).
 *
 * Mobile (< lg):   single column, content fills viewport, sticky bottom TabBar.
 * Desktop (≥ lg):  2-column grid — SideNav (240px) + main content.
 *                  TabBar hides; SideNav handles primary nav.
 *
 * The pb-[84px] on mobile main keeps content above the TabBar.
 * On desktop main has no bottom padding (no TabBar to clear).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <SideNav />
      <main className="app-shell-main pb-[84px] lg:pb-0">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
