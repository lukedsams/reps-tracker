import { ChecklistDay, DrinkEntry, JournalEntry, MealCompletion, MealKey, ExerciseLog } from "./store";
import { PROGRAM_START_DATE, WEEKLY_DEFICIT_BUDGET, ALL_DAYS, RECIPES } from "./data";

export type DayStatus = "full" | "minimum" | "missed" | "future" | "unlogged";

const HABITS: (keyof ChecklistDay)[] = ["workout", "protein", "calories", "water", "gratitude"];

export function habitsCompleted(day?: ChecklistDay): number { if (!day) return 0; return HABITS.filter((h) => day[h]).length; }

// Fixed: previously computed pure calendar-day math from PROGRAM_START_DATE,
// which is wrong whenever a week's dates aren't a contiguous 7-day continuation
// of the prior week (e.g. Week 2 starting Aug 3 after Week 1 ends July 19).
// Now looks up each day's real assigned dayNumber from ALL_DAYS, falling back
// to calendar-day extrapolation only for dates/day-numbers outside the known set.
export function dayNumberForDate(dateISO: string): number {
  const match = ALL_DAYS.find((d) => d.date === dateISO);
  if (match) return match.dayNumber;
  if (ALL_DAYS.length === 0) {
    const start = new Date(PROGRAM_START_DATE + "T00:00:00");
    const d = new Date(dateISO + "T00:00:00");
    const diffDays = Math.round((d.getTime() - start.getTime()) / 86400000);
    return diffDays + 1;
  }
  const last = ALL_DAYS[ALL_DAYS.length - 1];
  const d = new Date(dateISO + "T00:00:00");
  const lastDate = new Date(last.date + "T00:00:00");
  const diffDays = Math.round((d.getTime() - lastDate.getTime()) / 86400000);
  return last.dayNumber + diffDays;
}

export function dateForDayNumber(dayNumber: number): string {
  const match = ALL_DAYS.find((d) => d.dayNumber === dayNumber);
  if (match) return match.date;
  if (ALL_DAYS.length === 0) {
    const start = new Date(PROGRAM_START_DATE + "T00:00:00");
    const d = new Date(start.getTime() + (dayNumber - 1) * 86400000);
    return d.toISOString().slice(0, 10);
  }
  const last = ALL_DAYS[ALL_DAYS.length - 1];
  const diff = dayNumber - last.dayNumber;
  const d = new Date(last.date + "T00:00:00");
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

const APP_TIMEZONE = "America/Chicago";

export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function dayStatus(dateISO: string, checklist: Record<string, ChecklistDay>): DayStatus {
  const today = todayISO();
  if (dateISO > today) return "future";
  const day = checklist[dateISO];
  const completed = habitsCompleted(day);
  if (!day || completed === 0) { return dateISO === today ? "unlogged" : "missed"; }
  return completed === HABITS.length ? "full" : "minimum";
}

export function computeStreak(checklist: Record<string, ChecklistDay>, upToDayNumber: number): number {
  let streak = 0;
  for (let dn = upToDayNumber; dn >= 1; dn--) {
    const date = dateForDayNumber(dn);
    const status = dayStatus(date, checklist);
    if (status === "future") continue;
    if (status === "missed") break;
    if (status === "unlogged") continue;
    streak += 1;
  }
  return streak;
}

export function totalXP(checklist: Record<string, ChecklistDay>, drinks: DrinkEntry[] = [], upToDayNumber?: number, meals: Record<string, MealCompletion> = {}): number {
  let xp = 0;
  for (const key of Object.keys(checklist)) { const completed = habitsCompleted(checklist[key]); xp += completed * 10; if (completed === HABITS.length) xp += 20; }
  const dn = upToDayNumber ?? dayNumberForDate(todayISO());
  xp -= alcoholXPPenalty(drinks, dn);
  xp += totalMealGoalXP(meals);
  return Math.max(xp, 0);
}

export function levelForXP(xp: number): { level: number; intoLevel: number; forNext: number } {
  const perLevel = 300;
  const level = Math.floor(xp / perLevel) + 1;
  const intoLevel = xp % perLevel;
  return { level, intoLevel, forNext: perLevel };
}

export const MILESTONES = [25, 50, 75, 100];
export function achievedMilestones(currentDayNumber: number): number[] { return MILESTONES.filter((m) => currentDayNumber >= m); }
export function nextMilestone(currentDayNumber: number): number | null { return MILESTONES.find((m) => currentDayNumber < m) ?? null; }

export const DRINK_KCAL: Record<"beer" | "wine", number> = { beer: 150, wine: 125 };
export const SUGGESTED_WEEKLY_ALCOHOL_KCAL = 400;
export const MAXIMUM_WEEKLY_ALCOHOL_KCAL = WEEKLY_DEFICIT_BUDGET;
export const XP_PENALTY_PER_OVERAGE_DRINK = 25;

export function weekNumberForDay(dayNumber: number): number { return Math.max(1, Math.ceil(dayNumber / 7)); }
export function weekRangeForWeekNumber(weekNumber: number): { startDay: number; endDay: number } { return { startDay: (weekNumber - 1) * 7 + 1, endDay: weekNumber * 7 }; }

export function drinksInWeek(drinks: DrinkEntry[], weekNumber: number): DrinkEntry[] {
  const { startDay, endDay } = weekRangeForWeekNumber(weekNumber);
  return drinks.filter((d) => { const dn = dayNumberForDate(d.date); return dn >= startDay && dn <= endDay; });
}

export function weeklyDrinkKcal(entries: DrinkEntry[]): number { return entries.reduce((sum, e) => sum + DRINK_KCAL[e.type] * e.count, 0); }
export function weeklyDrinkCount(entries: DrinkEntry[]): number { return entries.reduce((sum, e) => sum + e.count, 0); }

export function suggestedDrinkCounts(): { beers: number; glassesOfWine: number } { return { beers: Math.floor(SUGGESTED_WEEKLY_ALCOHOL_KCAL / DRINK_KCAL.beer), glassesOfWine: Math.floor(SUGGESTED_WEEKLY_ALCOHOL_KCAL / DRINK_KCAL.wine) }; }
export function maximumDrinkCounts(): { beers: number; glassesOfWine: number } { return { beers: Math.floor(MAXIMUM_WEEKLY_ALCOHOL_KCAL / DRINK_KCAL.beer), glassesOfWine: Math.floor(MAXIMUM_WEEKLY_ALCOHOL_KCAL / DRINK_KCAL.wine) }; }

export function alcoholXPPenalty(drinks: DrinkEntry[], upToDayNumber: number): number {
  const weeks = weekNumberForDay(Math.max(upToDayNumber, 1));
  let penalty = 0;
  for (let w = 1; w <= weeks; w++) {
    const kcal = weeklyDrinkKcal(drinksInWeek(drinks, w));
    if (kcal > MAXIMUM_WEEKLY_ALCOHOL_KCAL) { const overKcal = kcal - MAXIMUM_WEEKLY_ALCOHOL_KCAL; const avgKcal = (DRINK_KCAL.beer + DRINK_KCAL.wine) / 2; penalty += Math.ceil(overKcal / avgKcal) * XP_PENALTY_PER_OVERAGE_DRINK; }
  }
  return penalty;
}

export type Daily5Aggregate = { workout: number; protein: number; calories: number; water: number; gratitude: number; totalDaysLogged: number; };

export function daily5Aggregate(checklist: Record<string, ChecklistDay>): Daily5Aggregate {
  const stats: Daily5Aggregate = { workout: 0, protein: 0, calories: 0, water: 0, gratitude: 0, totalDaysLogged: 0 };
  for (const key of Object.keys(checklist)) {
    const day = checklist[key];
    if (!day) continue;
    stats.totalDaysLogged += 1;
    if (day.workout) stats.workout += 1;
    if (day.protein) stats.protein += 1;
    if (day.calories) stats.calories += 1;
    if (day.water) stats.water += 1;
    if (day.gratitude) stats.gratitude += 1;
  }
  return stats;
}

export const RATING_KEYS = ["energy", "soreness", "sleepQuality", "motivation", "anxiety", "aggravation", "confidence", "hunger"] as const;
export type RatingKey = (typeof RATING_KEYS)[number];

const HABIT_KEYS_FOR_CORRELATION: (keyof ChecklistDay)[] = ["workout", "protein", "calories", "water"];

export type CorrelationResult = { rating: RatingKey; habit: keyof ChecklistDay; r: number; n: number };

function pearson(x: number[], y: number[]): number | null {
  const n = x.length;
  if (n < 4) return null;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0; let denX = 0; let denY = 0;
  for (let i = 0; i < n; i++) { const dx = x[i] - meanX; const dy = y[i] - meanY; num += dx * dy; denX += dx * dx; denY += dy * dy; }
  if (denX === 0 || denY === 0) return null;
  return num / Math.sqrt(denX * denY);
}

export function correlationMatrix(checklist: Record<string, ChecklistDay>, journal: Record<string, JournalEntry>, startDay: number, endDay: number): CorrelationResult[] {
  const results: CorrelationResult[] = [];
  for (const rating of RATING_KEYS) {
    for (const habit of HABIT_KEYS_FOR_CORRELATION) {
      const xs: number[] = []; const ys: number[] = [];
      for (let dn = startDay; dn <= endDay; dn++) {
        const date = dateForDayNumber(dn);
        const rv = journal[date]?.ratings?.[rating];
        const day = checklist[date];
        if (rv === undefined || !day) continue;
        xs.push(rv); ys.push(day[habit] ? 1 : 0);
      }
      const r = pearson(xs, ys);
      if (r !== null) results.push({ rating, habit, r, n: xs.length });
    }
  }
  return results.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
}

export function averageRatings(journal: Record<string, JournalEntry>, startDay: number, endDay: number): Partial<Record<RatingKey, number>> {
  const sums: Partial<Record<RatingKey, { total: number; count: number }>> = {};
  for (let dn = startDay; dn <= endDay; dn++) {
    const date = dateForDayNumber(dn);
    const ratings = journal[date]?.ratings;
    if (!ratings) continue;
    for (const key of RATING_KEYS) { const v = ratings[key]; if (v === undefined) continue; if (!sums[key]) sums[key] = { total: 0, count: 0 }; sums[key]!.total += v; sums[key]!.count += 1; }
  }
  const out: Partial<Record<RatingKey, number>> = {};
  for (const key of RATING_KEYS) { const s = sums[key]; if (s && s.count > 0) out[key] = s.total / s.count; }
  return out;
}

export type CheckpointCompletion = { full: number; minimum: number; missed: number; total: number; fullWinRate: number };

export function checkpointCompletion(checklist: Record<string, ChecklistDay>, startDay: number, endDay: number): CheckpointCompletion {
  let full = 0; let minimum = 0; let missed = 0; let total = 0;
  for (let dn = startDay; dn <= endDay; dn++) {
    const date = dateForDayNumber(dn);
    const completed = habitsCompleted(checklist[date]);
    total += 1;
    if (completed === HABITS.length) full += 1; else if (completed > 0) minimum += 1; else missed += 1;
  }
  return { full, minimum, missed, total, fullWinRate: total > 0 ? full / total : 0 };
}

export const CHECKPOINTS = [
  { label: "Days 1-25", startDay: 1, endDay: 25 },
  { label: "Days 26-50", startDay: 26, endDay: 50 },
  { label: "Days 51-75", startDay: 51, endDay: 75 },
  { label: "Days 76-100", startDay: 76, endDay: 100 },
] as const;

export function gratitudeComplete(entry?: JournalEntry): boolean { return Boolean(entry && entry.gratitudes.filter((g) => g.trim().length > 0).length === 5); }
export function availableCheckpoints(currentDayNumber: number) { return CHECKPOINTS.filter((c) => currentDayNumber >= c.endDay); }

const MEAL_KEYS: MealKey[] = ["breakfast", "snack", "lunch", "dinner"];
const CALORIE_TOLERANCE = 0.1;

// Fixed: previously only looked in WEEK_1, so meal auto-scoring silently
// broke for Week 2 onward. Now uses ALL_DAYS, same as actions.ts already did.
export function computeMealIntake(date: string, meals: MealCompletion): { calories: number; protein: number; mealsCompleted: number } {
  const workoutDay = ALL_DAYS.find((d) => d.date === date);
  let calories = 0; let protein = 0; let mealsCompleted = 0;
  for (const key of MEAL_KEYS) {
    if (!meals[key]) continue;
    const recipeId = workoutDay?.meals[key]?.recipeId;
    const recipe = recipeId ? RECIPES.find((r) => r.id === recipeId) : undefined;
    if (recipe) { calories += recipe.caloriesPerServing; protein += recipe.proteinPerServing; mealsCompleted += 1; }
  }
  return { calories, protein, mealsCompleted };
}

export function calorieGoalHit(actualCalories: number, targetCalories: number): boolean {
  const low = targetCalories * (1 - CALORIE_TOLERANCE);
  const high = targetCalories * (1 + CALORIE_TOLERANCE);
  return actualCalories >= low && actualCalories <= high;
}

export function proteinGoalHit(actualProtein: number, targetProtein: number): boolean { return actualProtein >= targetProtein; }

export const MEAL_GOAL_XP = 15;
export const MEAL_GOAL_PENALTY = 15;

export function mealGoalXPForDay(date: string, meals: MealCompletion): number {
  const workoutDay = ALL_DAYS.find((d) => d.date === date);
  if (!workoutDay) return 0;
  const { calories, protein, mealsCompleted } = computeMealIntake(date, meals);
  if (mealsCompleted < MEAL_KEYS.length) return 0;
  let xp = 0;
  xp += calorieGoalHit(calories, workoutDay.estCalories) ? MEAL_GOAL_XP : -MEAL_GOAL_PENALTY;
  xp += proteinGoalHit(protein, workoutDay.estProtein) ? MEAL_GOAL_XP : -MEAL_GOAL_PENALTY;
  return xp;
}

export function totalMealGoalXP(meals: Record<string, MealCompletion>): number {
  let xp = 0;
  for (const date of Object.keys(meals)) { xp += mealGoalXPForDay(date, meals[date]); }
  return xp;
}

export type ExerciseCorrelationResult = { habit: keyof ChecklistDay; r: number; n: number };

export function exerciseCorrelationMatrix(checklist: Record<string, ChecklistDay>, exerciseLogs: Record<string, ExerciseLog>, startDay: number, endDay: number): ExerciseCorrelationResult[] {
  const results: ExerciseCorrelationResult[] = [];
  for (const habit of HABIT_KEYS_FOR_CORRELATION) {
    const xs: number[] = []; const ys: number[] = [];
    for (let dn = startDay; dn <= endDay; dn++) {
      const date = dateForDayNumber(dn);
      const circuits = exerciseLogs[date]?.circuitsCompleted;
      const day = checklist[date];
      if (circuits === undefined || !day) continue;
      xs.push(circuits); ys.push(day[habit] ? 1 : 0);
    }
    const r = pearson(xs, ys);
    if (r !== null) results.push({ habit, r, n: xs.length });
  }
  return results.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
}

export function averageCircuits(exerciseLogs: Record<string, ExerciseLog>, startDay: number, endDay: number): number | undefined {
  const values: number[] = [];
  for (let dn = startDay; dn <= endDay; dn++) { const date = dateForDayNumber(dn); const v = exerciseLogs[date]?.circuitsCompleted; if (v !== undefined) values.push(v); }
  if (values.length === 0) return undefined;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
