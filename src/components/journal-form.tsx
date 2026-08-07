"use client";

import { useState, useTransition } from "react";
import { saveJournalEntry } from "@/lib/actions";
import { JournalEntry } from "@/lib/store";
import { RatingInput } from "@/components/rating-input";

const RATING_FIELDS: { key: keyof NonNullable<JournalEntry["ratings"]>; label: string }[] = [
  { key: "energy", label: "Energy" },
  { key: "soreness", label: "Soreness" },
  { key: "sleepQuality", label: "Sleep quality" },
  { key: "motivation", label: "Motivation" },
  { key: "anxiety", label: "Anxiety" },
  { key: "aggravation", label: "Aggravation" },
  { key: "confidence", label: "Confidence / self-esteem" },
  { key: "hunger", label: "Hunger" },
];

export function JournalForm({ date, existing }: { date: string; existing: JournalEntry | undefined }) {
  const [gratitudes, setGratitudes] = useState<string[]>(
    existing?.gratitudes && existing.gratitudes.length === 5 ? existing.gratitudes : ["", "", "", "", ""]
  );
  const [freeWrite, setFreeWrite] = useState(existing?.freeWrite ?? "");
  const [ratings, setRatings] = useState<NonNullable<JournalEntry["ratings"]>>(existing?.ratings ?? {});
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      await saveJournalEntry({ date, gratitudes, freeWrite, ratings });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">5 gratitudes</p>
        <div className="flex flex-col gap-2">
          {gratitudes.map((g, i) => (
            <label key={i} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-right font-[family-name:var(--font-data)] text-sm text-[var(--color-gold)]">{i + 1}</span>
              <input type="text" value={g} onChange={(e) => { const next = [...gratitudes]; next[i] = e.target.value; setGratitudes(next); }} placeholder={`Gratitude ${i + 1}`} className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-bone)]" />
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">Free write</p>
        <textarea value={freeWrite} onChange={(e) => setFreeWrite(e.target.value)} placeholder="Energy, soreness, sleep, anxiety, motivation, whatever's on your mind today..." rows={6} className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-bone)]" />
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">Quick ratings</p>
        <div className="flex flex-col gap-2.5">
          {RATING_FIELDS.map(({ key, label }) => (
            <RatingInput key={key} label={label} value={ratings[key]} onChange={(v) => setRatings((prev) => ({ ...prev, [key]: v }))} />
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={isPending} className="self-start rounded-lg bg-[var(--color-ember)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-opacity disabled:opacity-50">
        {justSaved ? "Saved" : "Save entry"}
      </button>
    </div>
  );
}
