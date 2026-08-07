import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getAllDays, getAllRecipes } from "@/lib/weeks-store";
import { getUserData } from "@/lib/store";
import { dayNumberForDate, habitsCompleted, todayISO, computeMealIntake, gratitudeComplete } from "@/lib/gamification";
import { Card, Eyebrow, Pill, StatNumber } from "@/components/ui";
import { ExerciseRow } from "@/components/exercise-row";
import { DayEditSection } from "@/components/day-edit-section";
import { JournalEditSection } from "@/components/journal-edit-section";

const HABIT_LABEL: Record<string, string> = { workout: "Workout / movement", protein: "Hit protein target", calories: "Stayed in calorie range", water: "Drank the gallon", gratitude: "Wrote 5 gratitudes" };
const MEAL_KEYS = ["breakfast", "snack", "lunch", "dinner"] as const;
const MEAL_LABEL: Record<(typeof MEAL_KEYS)[number], string> = { breakfast: "Breakfast", snack: "Snack", lunch: "Lunch", dinner: "Dinner" };

export default async function DayDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const data = await getUserData();
  const today = todayISO();
  const dayNumber = dayNumberForDate(date);
  const allDays = await getAllDays();
  const allRecipes = await getAllRecipes();
  const workoutDay = allDays.find((d) => d.date === date);
  const checklist = data.checklist[date];
  const meals = data.meals[date] ?? {};
  const exerciseLog = data.exerciseLogs[date];
  const journalEntry = data.journal[date];
  const weighIn = data.weighIns.find((w) => w.date === date);
  const photos = data.photos.filter((p) => p.date === date);
  const { calories: intakeCalories, protein: intakeProtein } = computeMealIntake(date, meals);
  const displayChecklist = checklist ? { ...checklist, gratitude: gratitudeComplete(journalEntry) } : undefined;
  const formatted = new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="flex flex-col gap-6">
      <Link href="/calendar" className="flex w-fit items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-bone)]"><ChevronLeft className="h-4 w-4" /> Calendar</Link>
      <div className="flex items-center justify-between gap-3">
        <div><Eyebrow>{dayNumber >= 1 ? `Day ${dayNumber}` : "Before the program"}</Eyebrow><h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">{formatted}</h1></div>
        {date === today && <Pill tone="gold">Today</Pill>}
      </div>

      {workoutDay ? (
        <>
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <Eyebrow>Training reference</Eyebrow>
              <div className="flex gap-1.5">{workoutDay.isShoppingDay && <Pill tone="success">Shopping day</Pill>}{workoutDay.isPrepDay && <Pill tone="gold">Prep day</Pill>}</div>
            </div>
            <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl tracking-wide">{workoutDay.focusTitle}</h2>
            {workoutDay.isRest ? (<p className="text-sm text-[var(--color-muted)]">{workoutDay.restNote}</p>) : (
              <ul className="flex flex-col">
                {workoutDay.exercises.map((ex) => (<ExerciseRow key={ex.part} part={ex.part} movement={ex.movement} />))}
                {workoutDay.focusSet && <ExerciseRow part="Focus set" movement={workoutDay.focusSet} />}
              </ul>
            )}
            <div className="mt-4 flex gap-4 border-t border-[var(--color-border)] pt-3 text-sm text-[var(--color-muted)]"><StatNumber value={workoutDay.estCalories} unit="kcal" /><StatNumber value={workoutDay.estProtein} unit="g protein" /></div>
          </Card>

          <div>
            <Eyebrow>Your entries for this day</Eyebrow>
            <DayEditSection date={date} workoutDay={workoutDay} recipes={allRecipes} existingChecklist={checklist} existingMeals={meals} existingExerciseLog={exerciseLog} journalEntry={journalEntry} readOnlySummary={
              <div className="flex flex-col gap-4">
                <Card>
                  <Eyebrow>Daily 5</Eyebrow>
                  {displayChecklist ? (
                    <>
                      <p className="mb-3 text-sm text-[var(--color-muted)]">{habitsCompleted(displayChecklist)} of 5 completed</p>
                      <ul className="flex flex-col gap-1.5 text-sm">
                        {Object.entries(HABIT_LABEL).map(([key, label]) => (
                          <li key={key} className="flex items-center gap-2"><span className={displayChecklist[key as keyof typeof displayChecklist] ? "text-[var(--color-success)]" : "text-[var(--color-muted)]"}>{displayChecklist[key as keyof typeof displayChecklist] ? "✓" : "—"}</span>{label}</li>
                        ))}
                      </ul>
                      <p className="mt-2 flex items-center gap-2 text-sm"><span className={checklist?.creatine ? "text-[var(--color-success)]" : "text-[var(--color-muted)]"}>{checklist?.creatine ? "✓" : "—"}</span>Creatine (5g)</p>
                    </>
                  ) : (<p className="text-sm text-[var(--color-muted)]">Nothing logged for this day.</p>)}
                </Card>
                <Card>
                  <Eyebrow>Meals</Eyebrow>
                  <ul className="mb-3 flex flex-col gap-1.5 text-sm">{MEAL_KEYS.map((key) => (<li key={key} className="flex items-center gap-2"><span className={meals[key] ? "text-[var(--color-success)]" : "text-[var(--color-muted)]"}>{meals[key] ? "✓" : "—"}</span>{MEAL_LABEL[key]}</li>))}</ul>
                  <p className="text-xs text-[var(--color-muted)]">{intakeCalories} / {workoutDay.estCalories} kcal &middot; {intakeProtein} / {workoutDay.estProtein} g protein</p>
                </Card>
                {!workoutDay.isRest && workoutDay.exercises.length > 0 && (
                  <Card>
                    <Eyebrow>Training log</Eyebrow>
                    <p className="text-sm text-[var(--color-muted)]">{exerciseLog?.circuitsCompleted !== undefined ? `${exerciseLog.circuitsCompleted} circuit${exerciseLog.circuitsCompleted === 1 ? "" : "s"} completed` : "No circuit count logged."}</p>
                    {exerciseLog?.results && Object.keys(exerciseLog.results).length > 0 && (<ul className="mt-2 flex flex-col gap-1 text-xs text-[var(--color-muted)]">{Object.entries(exerciseLog.results).map(([part, val]) => (<li key={part}>{part}: {val}</li>))}</ul>)}
                  </Card>
                )}
              </div>
            } />
          </div>
        </>
      ) : (<Card><p className="text-sm text-[var(--color-muted)]">No workout plan loaded for this date yet.</p></Card>)}

      {weighIn && (<Card><Eyebrow>Weigh-in</Eyebrow><StatNumber value={weighIn.weight} unit="lb" className="text-xl" /></Card>)}
      {photos.length > 0 && (<Card><Eyebrow>Photos</Eyebrow><div className="grid grid-cols-3 gap-2">{photos.map((p) => (<img key={p.id} src={`/api/photos/${p.id}`} alt={`${p.pose} progress photo`} className="aspect-[3/4] w-full rounded-lg object-cover" />))}</div></Card>)}
      <Card><Eyebrow>Journal</Eyebrow><JournalEditSection date={date} entry={journalEntry} /></Card>
    </div>
  );
}
