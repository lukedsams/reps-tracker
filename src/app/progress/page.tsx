import Link from "next/link";
import { Flame, Trophy, Lock, Star } from "lucide-react";
import { getAllRecipes } from "@/lib/weeks-store";
import { getUserData } from "@/lib/store";
import { todayISO, dayNumberForDate, computeStreak, totalXP, levelForXP, achievedMilestones, MILESTONES, daily5Aggregate, weekNumberForDay, drinksInWeek, weeklyDrinkKcal, SUGGESTED_WEEKLY_ALCOHOL_KCAL, MAXIMUM_WEEKLY_ALCOHOL_KCAL, suggestedDrinkCounts, maximumDrinkCounts } from "@/lib/gamification";
import { Card, Eyebrow, StatNumber } from "@/components/ui";
import { Daily5Chart } from "@/components/daily5-chart";
import { AlcoholTracker } from "@/components/alcohol-tracker";

const MILESTONE_LABEL: Record<number, string> = { 25: "Quarter Way", 50: "Halfway", 75: "Three Quarters", 100: "100 Days" };

export default async function ProgressPage() {
  const data = await getUserData();
  const allRecipes = await getAllRecipes();
  const today = todayISO();
  const dayNumber = Math.max(dayNumberForDate(today), 0);
  const streak = computeStreak(data.checklist, dayNumber);
  const xp = totalXP(data.checklist, data.drinks, dayNumber, data.meals);
  const { level, intoLevel, forNext } = levelForXP(xp);
  const unlocked = achievedMilestones(dayNumber);
  const favoriteRecipes = allRecipes.filter((r) => data.favorites.includes(r.id));
  const daysLogged = Object.keys(data.checklist).length;
  const fullWins = Object.values(data.checklist).filter((d) => d.workout && d.protein && d.calories && d.water && d.gratitude).length;
  const daily5Stats = daily5Aggregate(data.checklist);
  const weekNum = weekNumberForDay(Math.max(dayNumber, 1));
  const weekEntries = drinksInWeek(data.drinks, weekNum);
  const weeklyKcal = weeklyDrinkKcal(weekEntries);

  return (
    <div className="flex flex-col gap-6">
      <div><Eyebrow>Progress</Eyebrow><h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">Your Standing</h1></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} label="Current streak" value={streak} unit="days" color="var(--color-ember)" />
        <StatCard icon={Trophy} label="Level" value={level} color="var(--color-gold)" />
        <StatCard label="Days logged" value={daysLogged} unit={`/ ${dayNumber || 0}`} />
        <StatCard label="Full wins" value={fullWins} />
      </div>
      <Card className="!py-3">
        <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-muted)]"><span>Level {level} progress</span><span>{intoLevel} / {forNext} XP</span></div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]"><div className="h-full rounded-full bg-[var(--color-gold)]" style={{ width: `${(intoLevel / forNext) * 100}%` }} /></div>
        <p className="mt-2 text-xs text-[var(--color-muted)]">10 XP per Daily 5 habit, +20 bonus for a full 5/5 day, minus any weeks over the alcohol max.</p>
      </Card>
      <Card>
        <Eyebrow>Milestone badges</Eyebrow>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MILESTONES.map((m) => {
            const isUnlocked = unlocked.includes(m);
            return (
              <div key={m} className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center ${isUnlocked ? "border-[var(--color-gold)]/50 bg-[#4a3c14]" : "border-[var(--color-border)] bg-[var(--color-surface-2)]"}`}>
                {isUnlocked ? <Trophy className="h-6 w-6 text-[var(--color-gold)]" /> : <Lock className="h-6 w-6 text-[var(--color-muted)]" />}
                <div><p className={`text-sm font-medium ${isUnlocked ? "text-[var(--color-gold)]" : "text-[var(--color-muted)]"}`}>Day {m}</p><p className="text-xs text-[var(--color-muted)]">{MILESTONE_LABEL[m]}</p></div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card><Eyebrow>Daily 5 breakdown</Eyebrow><h2 className="mb-3 font-[family-name:var(--font-display)] text-xl tracking-wide">Which habits stick</h2><Daily5Chart stats={daily5Stats} /></Card>
      <Card>
        <Eyebrow>Beer &amp; wine</Eyebrow><h2 className="mb-3 font-[family-name:var(--font-display)] text-xl tracking-wide">This week&apos;s allowance</h2>
        <AlcoholTracker weekEntries={weekEntries} weeklyKcal={weeklyKcal} suggestedKcal={SUGGESTED_WEEKLY_ALCOHOL_KCAL} maximumKcal={MAXIMUM_WEEKLY_ALCOHOL_KCAL} suggestedCounts={suggestedDrinkCounts()} maximumCounts={maximumDrinkCounts()} />
      </Card>
      <Card>
        <Eyebrow>Favorited recipes</Eyebrow>
        {favoriteRecipes.length === 0 ? (<p className="text-sm text-[var(--color-muted)]">None yet, tap the star on any recipe to fold it into future weeks.</p>) : (
          <ul className="flex flex-col gap-2">{favoriteRecipes.map((r) => (<li key={r.id}><Link href={`/recipes/${r.id}`} className="flex items-center gap-2 text-sm text-[var(--color-bone)] hover:text-[var(--color-ember)]"><Star className="h-3.5 w-3.5 text-[var(--color-gold)]" fill="var(--color-gold)" />{r.name}</Link></li>))}</ul>
        )}
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, unit, color }: { icon?: React.ElementType; label: string; value: string | number; unit?: string; color?: string }) {
  return (
    <Card className="flex flex-col items-start gap-1">
      {Icon && <Icon className="h-4 w-4" style={{ color: color ?? "var(--color-muted)" }} />}
      <StatNumber value={value} unit={unit} className="text-xl" />
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
    </Card>
  );
}
