"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarRange, ChefHat, ShoppingCart, LineChart, Flame, Timer, Camera, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Today", icon: LayoutGrid },
  { href: "/calendar", label: "Calendar", icon: CalendarRange },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/recipes", label: "Recipes", icon: ChefHat },
  { href: "/shopping-list", label: "Shopping", icon: ShoppingCart },
  { href: "/weigh-ins", label: "Weigh-Ins", icon: LineChart },
  { href: "/photos", label: "Photos", icon: Camera },
  { href: "/timer", label: "Timer", icon: Timer },
  { href: "/progress", label: "Progress", icon: Flame },
];

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-full md:flex">
      <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-[var(--color-border)] md:px-4 md:py-6 md:shrink-0">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2">
            <ChainMark className="h-6 w-6 text-[var(--color-ember)]" />
            <span className="font-[family-name:var(--font-display)] text-lg tracking-wide text-[var(--color-bone)]">100 DAY LOG</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-[var(--color-surface)] text-[var(--color-bone)]" : "text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-bone)]"}`}>
                <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} style={{ color: active ? "var(--color-ember)" : undefined }} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3 md:hidden">
        <ChainMark className="h-5 w-5 text-[var(--color-ember)]" />
        <span className="font-[family-name:var(--font-display)] text-base tracking-wide">100 DAY LOG</span>
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8 md:py-10">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex overflow-x-auto border-t border-[var(--color-border)] bg-[var(--color-ink)] md:hidden">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex min-w-[58px] flex-1 flex-col items-center gap-0.5 py-2 text-[9px]" style={{ color: active ? "var(--color-ember)" : "var(--color-muted)" }}>
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function ChainMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="8" width="8" height="8" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="8" width="8" height="8" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M10 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
