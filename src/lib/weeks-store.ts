import { Redis } from "@upstash/redis";
import { WEEK_1, WEEK_2, RECIPES, GROCERY_LIST, GROCERY_LIST_WEEK_2, WorkoutDay, Recipe, GroceryItem } from "./data";

// Stage 1: storage + merge layer for auto-generated weeks (Week 3+).
// Not yet wired into any page — purely additive, safe to deploy alongside
// the existing static Week 1 / Week 2 flow.

export type GeneratedWeek = {
  weekNumber: number;
  days: WorkoutDay[];
  recipes: Recipe[];
  groceryList: GroceryItem[];
  generatedAt: string;
};

const KEY = "reps-tracker:generated-weeks";

const hasRedis = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let redis: Redis | null = null;
if (hasRedis) {
  redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });
}

let memoryFallback: GeneratedWeek[] = [];

export async function getGeneratedWeeks(): Promise<GeneratedWeek[]> {
  if (redis) {
    const data = await redis.get<GeneratedWeek[]>(KEY);
    return data ?? [];
  }
  return memoryFallback;
}

export async function saveGeneratedWeek(week: GeneratedWeek): Promise<void> {
  const existing = await getGeneratedWeeks();
  const next = [...existing.filter((w) => w.weekNumber !== week.weekNumber), week].sort((a, b) => a.weekNumber - b.weekNumber);
  if (redis) {
    await redis.set(KEY, next);
  } else {
    memoryFallback = next;
  }
}

export async function getAllDays(): Promise<WorkoutDay[]> {
  const generated = await getGeneratedWeeks();
  const generatedDays = generated.flatMap((w) => w.days);
  return [...WEEK_1, ...WEEK_2, ...generatedDays].sort((a, b) => a.dayNumber - b.dayNumber);
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const generated = await getGeneratedWeeks();
  const generatedRecipes = generated.flatMap((w) => w.recipes);
  return [...RECIPES, ...generatedRecipes];
}

export async function getGroceryListForWeek(weekNumber: number): Promise<GroceryItem[]> {
  if (weekNumber === 1) return GROCERY_LIST;
  if (weekNumber === 2) return GROCERY_LIST_WEEK_2;
  const generated = await getGeneratedWeeks();
  const week = generated.find((w) => w.weekNumber === weekNumber);
  return week?.groceryList ?? [];
}

export async function getAvailableWeekNumbers(): Promise<number[]> {
  const days = await getAllDays();
  if (days.length === 0) return [1];
  const maxDayNumber = Math.max(...days.map((d) => d.dayNumber));
  const maxWeek = Math.max(1, Math.ceil(maxDayNumber / 7));
  return Array.from({ length: maxWeek }, (_, i) => i + 1);
}

// Used as "don't repeat these" context when prompting Claude to generate a new week.
export async function getUsedRecipeContext(): Promise<string> {
  const recipes = await getAllRecipes();
  const lunchDinner = recipes.filter((r) => r.meal === "lunch" || r.meal === "dinner");
  return lunchDinner.map((r) => `${r.name} (${r.vegetarian ? "vegetarian" : "meat/fish"})`).join(", ");
}
