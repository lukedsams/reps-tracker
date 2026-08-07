"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { JournalView } from "@/components/journal-view";
import { JournalForm } from "@/components/journal-form";
import { JournalEntry } from "@/lib/store";

export function JournalEditSection({ date, entry }: { date: string; entry?: JournalEntry }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="flex flex-col gap-3">
        <button onClick={() => setEditing(false)} className="flex w-fit items-center gap-1.5 self-end text-xs text-[var(--color-muted)]"><X className="h-3.5 w-3.5" /> Close</button>
        <JournalForm date={date} existing={entry} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entry ? <JournalView entry={entry} /> : <p className="text-sm text-[var(--color-muted)]">No journal entry for this day.</p>}
      <button onClick={() => setEditing(true)} className="flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-surface-2)] px-3 py-1.5 text-xs text-[var(--color-gold)]"><Pencil className="h-3.5 w-3.5" /> Edit</button>
    </div>
  );
}
