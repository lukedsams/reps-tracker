"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveDayEntry } from "@/lib/actions";
import { Recipe, WorkoutDay } from "@/lib/data";
import { ChecklistDay, MealCompletion, ExerciseLog } from "@/lib/store";
import { ExerciseRow } from "@/components/exercise-row";
import { Card, Eyebrow } from "@/components/ui";
import { calorieGoalHit, proteinGoalHit, gratitudeComplete } from "@/lib/gamification";
import { JournalEntry } from "@/lib/store";

const MEAL_KEYS = ["breakfast", "snack", "lunch", "dinner"] as const;
const MEAL_LABEL: Record<(typeof MEAL_KEYS)[number], string> = { breakfast: "Breakfast", snack: "Snack", lunch: "Lunch", dinner: "Dinner" };

export function DayEntryForm({ date, workoutDay, recipes, existingChecklist, existingMeals, existingExerciseLog, journalEntry, onSaved }: { date: string; workoutDay: WorkoutDay; recipes: Recipe[]; existingChecklist?: ChecklistDay; existingMeals?: MealCompletion; existingExerciseLog?: ExerciseLog; journalEntry?: JournalEntry; onSaved?: () => void; }) {
  const [workout, setWorkout] = useState(existingChecklist?.workout ?? workoutDay.isRest);
  const [water, setWater] = useState(existingChecklist?.water ?? false);
  const [creatine, setCreatine] = useState(existingChecklist?.creatine ?? false);
  const [meals, setMeals] = useState<MealCompletion>(existingMeals ?? {});
  const [circuits, setCircuits] = useState<number | "">(existingExerciseLog?.circuitsCompleted ?? "");
  const [results, setResults] = useState<Record<string, number>>(existingExerciseLog?.results ?? {});
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const calories = MEAL_KEYS.reduce((sum, key) => { if (!meals[key]) return sum; const recipe = recipes.find((r) => r.id === workoutDay.meals[key].recipeId); return sum + (recipe?.caloriesPerServing ?? 0); }, 0);
  const protein = MEAL_KEYS.reduce((sum, key) => { if (!meals[key]) return sum; const recipe = recipes.find((r) => r.id === workoutDay.meals[key].recipeId); return sum + (recipe?.proteinPerServing ?? 0); }, 0);
  const caloriePct = Math.min((calories / workoutDay.estCalories) * 100, 100);
  const proteinPct = Math.min((protein / workoutDay.estProtein) * 100, 100);
  const mealsCompleted = MEAL_KEYS.filter((key) => meals[key]).length;
  const calorieHit = calorieGoalHit(calories, workoutDay.estCalories);
  const proteinHit = proteinGoalHit(protein, workoutDay.estProtein);

  const handleSave = () => {
    startTransition(async () => {
      await saveDayEntry({ date, workout, water, creatine, meals, exerciseLog: { circuitsCompleted: circuits === "" ? undefined : circuits, results } });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
      onSaved?.();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Eyebrow>Meals</Eyebrow>
        <div className="mb-4 flex flex-col gap-2">
          {MEAL_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm">
              <input id={`meal-${date}-${key}`} type="checkbox" checked={Boolean(meals[key])} onChange={(e) => setMeals((m) => ({ ...m, [key]: e.target.checked }))} className="h-4 w-4 shrink-0" />
              <label htmlFor={`meal-${date}-${key}`} className="flex-1 cursor-pointer">{MEAL_LABEL[key]}</label>
              <Link href={`/recipes/${workoutDay.meals[key].recipeId}`} className="text-xs text-[var(--color-gold)] underline">{workoutDay.meals[key].name}</Link>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <div className="mb-1 flex justify-between text-xs text-[var(--color-muted)]"><span>Calories</span><span>{calories} / {workoutDay.estCalories} kcal</span></div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]"><div className="h-full rounded-full bg-[var(--color-ember)]" style={{ width: `${caloriePct}%` }} /></div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-[var(--color-muted)]"><span>Protein</span><span>{protein} / {workoutDay.estProtein} g</span></div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]"><div className="h-full rounded-full bg-[var(--color-success)]" style={{ width: `${proteinPct}%` }} /></div>
          </div>
          <p className="text-[10px] text-[var(--color-muted)]">Protein/calorie goal XP scores once all 4 meals are checked for the day.</p>
        </div>
      </Card>

      {!workoutDay.isRest && workoutDay.exercises.length > 0 && (
        <Card>
          <Eyebrow>Training log</Eyebrow>
          <label className="mb-3 flex items-center gap-2 text-sm text-[var(--color-bone)]">Circuits completed
            <input type="number" min={0} inputMode="numeric" value={circuits} onChange={(e) => setCircuits(e.target.value === "" ? "" : Number(e.target.value))} className="w-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1 text-sm text-[var(--color-bone)]" />
          </label>
          <ul className="flex flex-col">
            {workoutDay.exercises.map((ex) => (
              <ExerciseRow key={ex.part} part={ex.part} movement={ex.movement} logValue={results[ex.part]} onLogChange={(v) => setResults((r) => ({ ...r, [ex.part]: v }))} />
            ))}
            {workoutDay.focusSet && (<ExerciseRow part="Focus set" movement={workoutDay.focusSet} logValue={results["Focus set"]} onLogChange={(v) => setResults((r) => ({ ...r, "Focus set": v }))} />)}
          </ul>
        </Card>
      )}

      <Card>
        <Eyebrow>Daily 5</Eyebrow>
        <div className="flex flex-col gap-2">
          {workoutDay.isRest ? (
            <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm">
              <span className="text-[var(--color-success)]">{"✓"}</span>
              <span className="flex-1">Workout / movement</span>
              <span className="text-[10px] text-[var(--color-muted)]">auto (rest day)</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm">
              <input id={`workout-${date}`} type="checkbox" checked={workout} onChange={(e) => setWorkout(e.target.checked)} className="h-4 w-4" />
              <label htmlFor={`workout-${date}`} className="cursor-pointer">Workout / movement</label>
            </div>
          )}
          <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm">
            <span className={mealsCompleted === 4 && proteinHit ? "text-[var(--color-success)]" : "text-[var(--color-muted)]"}>{mealsCompleted === 4 && proteinHit ? "✓" : "—"}</span>
            <span className="flex-1">Hit protein target</span>
            <span className="text-[10px] text-[var(--color-muted)]">auto</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm">
            <span className={mealsCompleted === 4 && calorieHit ? "text-[var(--color-success)]" : "text-[var(--color-muted)]"}>{mealsCompleted === 4 && calorieHit ? "✓" : "—"}</span>
            <span className="flex-1">Stayed in calorie range</span>
            <span className="text-[10px] text-[var(--color-muted)]">auto</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm">
            <input id={`water-${date}`} type="checkbox" checked={water} onChange={(e) => setWater(e.target.checked)} className="h-4 w-4" />
            <label htmlFor={`water-${date}`} className="cursor-pointer">Drank the gallon</label>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm">
            <input id={`creatine-${date}`} type="checkbox" checked={creatine} onChange={(e) => setCreatine(e.target.checked)} className="h-4 w-4" />
            <label htmlFor={`creatine-${date}`} className="cursor-pointer">Creatine (5g)</label>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm">
            <span className={gratitudeComplete(journalEntry) ? "text-[var(--color-success)]" : "text-[var(--color-muted)]"}>{gratitudeComplete(journalEntry) ? "✓" : "—"}</span>
            <span className="flex-1">Wrote 5 gratitudes</span>
            <span className="text-[10px] text-[var(--color-muted)]">auto</span>
          </div>
          <p className="text-xs text-[var(--color-muted)]">Protein and calories auto-score from the meals checked above once all 4 are checked. Gratitude auto-scores from your Journal entry and updates after you Save &amp; Submit.</p>
        </div>
      </Card>

      <button onClick={handleSave} disabled={isPending} className="self-start rounded-lg bg-[var(--color-ember)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition-opacity disabled:opacity-50">
        {justSaved ? "Saved" : "Save & Submit"}
      </button>
    </div>
  );
}
