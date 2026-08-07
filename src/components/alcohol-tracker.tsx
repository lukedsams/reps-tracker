"use client";

import { useTransition } from "react";
import { Beer, Wine } from "lucide-react";
import { logDrink } from "@/lib/actions";
import { todayISO } from "@/lib/gamification";
import { DrinkEntry } from "@/lib/store";

export function AlcoholTracker({ weekEntries, weeklyKcal, suggestedKcal, maximumKcal, suggestedCounts, maximumCounts }: { weekEntries: DrinkEntry[]; weeklyKcal: number; suggestedKcal: number; maximumKcal: number; suggestedCounts: { beers: number; glassesOfWine: number }; maximumCounts: { beers: number; glassesOfWine: number } }) {
  const [isPending, startTransition] = useTransition();
  const beers = weekEntries.filter((d) => d.type === "beer").reduce((s, d) => s + d.count, 0);
  const wines = weekEntries.filter((d) => d.type === "wine").reduce((s, d) => s + d.count, 0);
  const pct = Math.min((weeklyKcal / maximumKcal) * 100, 100);
  const overMax = weeklyKcal > maximumKcal;
  const log = (type: "beer" | "wine") => { startTransition(() => { logDrink(todayISO(), type, 1); }); };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <button onClick={() => log("beer")} disabled={isPending} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-bone)] disabled:opacity-60"><Beer className="h-4 w-4" /> Log a beer</button>
        <button onClick={() => log("wine")} disabled={isPending} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-bone)] disabled:opacity-60"><Wine className="h-4 w-4" /> Log a wine</button>
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-muted)]">
          <span>This week: {beers} beer{beers === 1 ? "" : "s"}, {wines} wine{wines === 1 ? "" : "s"}</span>
          <span className={overMax ? "text-[var(--color-ember)]" : ""}>{weeklyKcal} / {maximumKcal} kcal</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]"><div className={`h-full rounded-full ${overMax ? "bg-[var(--color-ember)]" : "bg-[var(--color-gold)]"}`} style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="flex flex-col gap-1.5 text-xs text-[var(--color-muted)]">
        <p>Suggested: up to {suggestedCounts.beers} beers or {suggestedCounts.glassesOfWine} glasses of wine this week ({suggestedKcal} kcal), barely touches the deficit.</p>
        <p>Maximum: {maximumCounts.beers} beers or {maximumCounts.glassesOfWine} glasses of wine ({maximumKcal} kcal) is where your weekly deficit hits zero. Not a target, just where the math stops working for you. Going over costs XP.</p>
      </div>
    </div>
  );
}
