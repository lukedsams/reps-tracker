"use client";

import { useState, useTransition } from "react";
import { logWeighIn } from "@/lib/actions";
import { todayISO } from "@/lib/gamification";

export function WeighInForm() {
  const [date, setDate] = useState(todayISO());
  const [weight, setWeight] = useState("");
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); const w = parseFloat(weight); if (Number.isNaN(w)) return; startTransition(async () => { await logWeighIn(date, w); setJustSaved(true); setWeight(""); setTimeout(() => setJustSaved(false), 2000); }); }} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-xs text-[var(--color-muted)]">Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-bone)]" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-[var(--color-muted)]">Weight (lb)
        <input type="number" step="0.1" inputMode="decimal" placeholder="177.4" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-28 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-bone)]" />
      </label>
      <button type="submit" disabled={isPending || !weight} className="rounded-lg bg-[var(--color-ember)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-opacity disabled:opacity-50">{justSaved ? "Saved" : "Log weigh-in"}</button>
    </form>
  );
}
