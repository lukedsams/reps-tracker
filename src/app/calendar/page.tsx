import Link from "next/link";
import { ShoppingCart, ChefHat } from "lucide-react";
import { getAllDays, getAvailableWeekNumbers } from "@/lib/weeks-store";
import { getUserData } from "@/lib/store";
import { todayISO, dayStatus, dayNumberForDate, weekNumberForDay } from "@/lib/gamification";
import { Card, Eyebrow, Pill, StatNumber } from "@/components/ui";
import { ChainTracker } from "@/components/chain-tracker";

function shortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const { week } = await searchParams;
  const data = await getUserData();
  const today = todayISO();
  const allDays = await getAllDays();
  const availableWeeks = await getAvailableWeekNumbers();
  const maxWeek = availableWeeks[availableWeeks.length - 1] ?? 1;
  const currentWeek = Math.min(Math.max(weekNumberForDay(Math.max(dayNumberForDate(today), 1)), 1), maxWeek);
  const parsedWeek = week ? Number(week) : NaN;
  const selectedWeek = availableWeeks.includes(parsedWeek) ? parsedWeek : currentWeek;
  const days = allDays.filter((d) => weekNumberForDay(d.dayNumber) === selectedWeek);
  const rangeLabel = days.length > 0 ? `${days[0].shortLabel} ${shortDate(days[0].date)} – ${days[days.length - 1].shortLabel} ${shortDate(days[days.length - 1].date)}` : "";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Eyebrow>Week {selectedWeek}</Eyebrow>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">{rangeLabel}</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Tap any day to see the full detail, including that day&apos;s journal entry.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableWeeks.map((w) => (
          <Link key={w} href={`/calendar?week=${w}`} className={`rounded-full px-3 py-1.5 text-xs font-medium ${selectedWeek === w ? "bg-[var(--color-ember)] text-[var(--color-ink)]" : "bg-[var(--color-surface-2)] text-[var(--color-muted)]"}`}>Week {w}</Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-[var(--color-muted)]">
        <span className="flex items-center gap-1.5"><ShoppingCart className="h-3.5 w-3.5 text-[var(--color-success)]" /> Shopping day</span>
        <span className="flex items-center gap-1.5"><ChefHat className="h-3.5 w-3.5 text-[var(--color-gold)]" /> Prep day</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((day) => {
          const status = dayStatus(day.date, data.checklist);
          const isToday = day.date === today;
          return (
            <Link key={day.date} href={`/day/${day.date}`}>
              <Card className={`h-full transition-colors hover:border-[var(--color-ember)] ${isToday ? "!border-[var(--color-ember)]" : ""}`}>
                <div className="mb-2 flex items-center justify-between">
                  <div><p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{day.dayLabel}, Day {day.dayNumber}</p><p className="font-[family-name:var(--font-display)] text-lg tracking-wide">{day.focusTitle}</p></div>
                  {statusPill(status)}
                </div>
                {(day.isShoppingDay || day.isPrepDay) && (
                  <div className="mb-2 flex gap-1.5">
                    {day.isShoppingDay && (<span className="flex items-center gap-1 rounded-full bg-[#1f3d2a] px-2 py-0.5 text-[10px] text-[var(--color-success)]"><ShoppingCart className="h-3 w-3" /> Shopping</span>)}
                    {day.isPrepDay && (<span className="flex items-center gap-1 rounded-full bg-[#4a3c14] px-2 py-0.5 text-[10px] text-[var(--color-gold)]"><ChefHat className="h-3 w-3" /> Prep</span>)}
                  </div>
                )}
                <div className="flex gap-4 text-xs text-[var(--color-muted)]"><StatNumber value={day.estCalories} unit="kcal" /><StatNumber value={day.estProtein} unit="g protein" /></div>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-[var(--color-muted)]"><span>Cook tonight: {day.meals.dinner.name}</span></div>
              </Card>
            </Link>
          );
        })}
      </div>
      <Card><Eyebrow>The chain</Eyebrow><h2 className="mb-4 font-[family-name:var(--font-display)] text-xl tracking-wide">100 days, don&apos;t break it</h2><ChainTracker checklist={data.checklist} /></Card>
    </div>
  );
}

function statusPill(status: ReturnType<typeof dayStatus>) {
  switch (status) {
    case "full": return <Pill tone="gold">Full win</Pill>;
    case "minimum": return <Pill tone="success">Showed up</Pill>;
    case "missed": return <Pill tone="ember">Missed</Pill>;
    case "unlogged": return <Pill>Today</Pill>;
    default: return null;
  }
}
