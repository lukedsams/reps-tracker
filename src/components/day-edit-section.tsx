"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { DayEntryForm } from "@/components/day-entry-form";
import { Recipe, WorkoutDay } from "@/lib/data";
import { ChecklistDay, MealCompletion, ExerciseLog, JournalEntry } from "@/lib/store";

export function DayEditSection({ date, workoutDay, recipes, existingChecklist, existingMeals, existingExerciseLog, journalEntry, readOnlySummary }: { date: string; workoutDay: WorkoutDay; recipes: Recipe[]; existingChecklist?: ChecklistDay; existingMeals?: MealCompletion; existingExerciseLog?: ExerciseLog; journalEntry?: JournalEntry; readOnlySummary: React.ReactNode; }) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <div className="flex flex-col gap-3">
        {readOnlySummary}
        <button onClick={() => setEditing(true)} className="flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-surface-2)] px-3 py-1.5 text-xs text-[var(--color-gold)]">
          <Pencil className="h-3.5 w-3.5" /> Edit this day
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button onClick={() => setEditing(false)} className="flex w-fit items-center gap-1.5 self-end text-xs text-[var(--color-muted)]">
        <X className="h-3.5 w-3.5" /> Cancel
      </button>
      <DayEntryForm date={date} workoutDay={workoutDay} recipes={recipes} existingChecklist={existingChecklist} existingMeals={existingMeals} existingExerciseLog={existingExerciseLog} journalEntry={journalEntry} onSaved={() => setEditing(false)} />
    </div>
  );
}
