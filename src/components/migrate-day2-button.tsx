"use client";

import { useState, useTransition } from "react";
import { migrateDay2JournalToDay1 } from "@/lib/actions";

export function MigrateDay2Button() {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <button onClick={() => startTransition(async () => { await migrateDay2JournalToDay1(); setDone(true); })} disabled={isPending || done} className="rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-opacity disabled:opacity-50">
      {done ? "Moved to Day 1" : isPending ? "Moving..." : "Move Day 2 entries to Day 1"}
    </button>
  );
}
