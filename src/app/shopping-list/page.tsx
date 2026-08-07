import Link from "next/link";
import { getAllDays, getAvailableWeekNumbers, getGroceryListForWeek } from "@/lib/weeks-store";
import { getUserData } from "@/lib/store";
import { todayISO, dayNumberForDate, weekNumberForDay } from "@/lib/gamification";
import { Eyebrow } from "@/components/ui";
import { ShoppingListClient } from "@/components/shopping-list-client";
import { ExportButton } from "@/components/export-button";
import { formatGroceryListForExport } from "@/lib/export";

function shortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default async function ShoppingListPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const { week } = await searchParams;
  const data = await getUserData();
  const today = todayISO();
  const allDays = await getAllDays();
  const availableWeeks = await getAvailableWeekNumbers();
  const maxWeek = availableWeeks[availableWeeks.length - 1] ?? 1;
  const dayNumber = Math.max(dayNumberForDate(today), 1);
  const cycleWeek = weekNumberForDay(dayNumber);
  const todayWorkoutDay = allDays.find((d) => d.date === today);
  const defaultWeek = Math.min(todayWorkoutDay?.isShoppingDay ? cycleWeek + 1 : cycleWeek, maxWeek);
  const parsedWeek = week ? Number(week) : NaN;
  const selectedWeek = availableWeeks.includes(parsedWeek) ? parsedWeek : Math.max(defaultWeek, 1);
  const weekDays = allDays.filter((d) => weekNumberForDay(d.dayNumber) === selectedWeek);
  const rangeLabel = weekDays.length > 0 ? `${weekDays[0].shortLabel} ${shortDate(weekDays[0].date)} – ${weekDays[weekDays.length - 1].shortLabel} ${shortDate(weekDays[weekDays.length - 1].date)}` : "";
  const items = await getGroceryListForWeek(selectedWeek);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div><Eyebrow>Week {selectedWeek} &middot; {rangeLabel}</Eyebrow><h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">Shopping List</h1></div>
        <ExportButton text={formatGroceryListForExport(items)} />
      </div>
      <div className="flex flex-wrap gap-2">
        {availableWeeks.map((w) => (
          <Link key={w} href={`/shopping-list?week=${w}`} className={`rounded-full px-3 py-1.5 text-xs font-medium ${selectedWeek === w ? "bg-[var(--color-ember)] text-[var(--color-ink)]" : "bg-[var(--color-surface-2)] text-[var(--color-muted)]"}`}>Week {w}</Link>
        ))}
      </div>
      <ShoppingListClient items={items} checked={data.shoppingChecked} weekNumber={selectedWeek} />
    </div>
  );
}
