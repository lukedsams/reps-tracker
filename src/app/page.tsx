import { Flame, Trophy } from "lucide-react";
import { TARGETS, PROGRAM_START_DATE } from "@/lib/data";
import { getAllDays, getAllRecipes } from "@/lib/weeks-store";
import { getUserData } from "@/lib/store";
import { todayISO, dayNumberForDate, dateForDayNumber, computeStreak, totalXP, levelForXP, nextMilestone } from "@/lib/gamification";
import { quoteForDay } from "@/lib/quotes";
import { Card, Eyebrow, Pill, StatNumber } from "@/components/ui";
import { QuoteBanner } from "@/components/quote-banner";
import { DayEntryForm } from "@/components/day-entry-form";

export default async function DashboardPage() {
  const today = todayISO();
  const dayNumber = dayNumberForDate(today);
  const data = await getUserData();
  const allDays = await getAllDays();
  const allRecipes = await getAllRecipes();
  const workoutDay = allDays.find((d) => d.date === today);

  const streak = computeStreak(data.checklist, Math.max(dayNumber, 0));
  const xp = totalXP(data.checklist, data.drinks, Math.max(dayNumber, 0), data.meals);
  const { level, intoLevel, forNext } = levelForXP(xp);
  const upcoming = nextMilestone(Math.max(dayNumber, 0));
  const quote = quoteForDay(Math.max(dayNumber, 1));

  return (
    <div className="flex flex-col gap-6">
      <QuoteBanner quote={quote} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>{dayNumber >= 1 ? `Day ${dayNumber} of 100` : "Before Day 1"}</Eyebrow>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-[var(--color-bone)]">{formatLongDate(today)}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-ember-dim)] px-3 py-1.5"><Flame className="h-4 w-4 text-[var(--color-ember)]" /><StatNumber value={streak} className="text-sm text-[#ffd7c2]" /></div>
          <div className="flex items-center gap-1.5 rounded-full bg-[#4a3c14] px-3 py-1.5"><Trophy className="h-4 w-4 text-[var(--color-gold)]" /><StatNumber value={`Lv ${level}`} className="text-sm text-[var(--color-gold)]" /></div>
        </div>
      </div>

      <Card className="!py-3">
        <div className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-1.5">
          <span>Level {level}</span>
          <span>{intoLevel} / {forNext} XP{upcoming && <span className="ml-2 text-[var(--color-gold)]">Day {upcoming} badge next</span>}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[var(--color-surface-2)] overflow-hidden"><div className="h-full rounded-full bg-[var(--color-gold)]" style={{ width: `${(intoLevel / forNext) * 100}%` }} /></div>
      </Card>

      {!workoutDay ? (<EmptyDayState today={today} dayNumber={dayNumber} />) : (
        <>
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <div><Eyebrow>Today&apos;s focus</Eyebrow><h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide">{workoutDay.focusTitle}</h2></div>
              {workoutDay.isRest && <Pill tone="gold">Rest day</Pill>}
            </div>
            {workoutDay.isRest && <p className="text-sm text-[var(--color-muted)]">{workoutDay.restNote}</p>}
            <div className="mt-2 flex gap-4 text-sm text-[var(--color-muted)]"><span>Target <StatNumber value={workoutDay.estCalories} unit="kcal" /></span><span><StatNumber value={workoutDay.estProtein} unit="g protein" /></span></div>
          </Card>
          <DayEntryForm date={today} workoutDay={workoutDay} recipes={allRecipes} existingChecklist={data.checklist[today]} existingMeals={data.meals[today]} existingExerciseLog={data.exerciseLogs[today]} journalEntry={data.journal[today]} />
        </>
      )}
      <p className="text-center text-xs text-[var(--color-muted)]">Water goal: {TARGETS.waterGallons} gallon · every day counts, full win or minimum win.</p>
    </div>
  );
}

function EmptyDayState({ today, dayNumber }: { today: string; dayNumber: number }) {
  if (dayNumber < 1) {
    const prepDate = dateForDayNumber(0);
    const isPrepDayToday = today === prepDate;
    return (
      <Card>
        <Eyebrow>Not started yet</Eyebrow>
        <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide mb-2">Day 1 starts {formatLongDate(PROGRAM_START_DATE)}</h2>
        <p className="text-sm text-[var(--color-muted)]">{isPrepDayToday ? "Today's the kickoff prep day, cook the steak batch and egg muffins so breakfast and lunch are ready when Day 1 starts." : `Kickoff prep day is ${formatLongDate(prepDate)}, cook the steak batch and egg muffins that day so breakfast and lunch are ready when Day 1 starts.`}</p>
      </Card>
    );
  }
  return (
    <Card>
      <Eyebrow>No plan loaded for this day yet</Eyebrow>
      <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide mb-2">Day {dayNumber}</h2>
      <p className="text-sm text-[var(--color-muted)]">This week hasn&apos;t generated yet. New weeks auto-generate every Thursday, check back soon or trigger it manually from the cron endpoint.</p>
    </Card>
  );
}

function formatLongDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
