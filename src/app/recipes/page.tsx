import Link from "next/link";
import { WorkoutDay } from "@/lib/data";
import { getAllDays, getAllRecipes, getAvailableWeekNumbers } from "@/lib/weeks-store";
import { getUserData } from "@/lib/store";
import { weekNumberForDay } from "@/lib/gamification";
import { Card, Eyebrow, Pill, StatNumber } from "@/components/ui";
import { FavoriteButton } from "@/components/favorite-button";
import { ExportButton } from "@/components/export-button";
import { formatAllRecipesForExport } from "@/lib/export";

const MEAL_ORDER = ["breakfast", "snack", "lunch", "dinner"] as const;
const MEAL_LABEL: Record<(typeof MEAL_ORDER)[number], string> = { breakfast: "Breakfast", snack: "Snack", lunch: "Lunch", dinner: "Dinner" };

function recipeIdsForWeek(days: WorkoutDay[]): Set<string> {
  const ids = new Set<string>();
  for (const day of days) { for (const key of MEAL_ORDER) ids.add(day.meals[key].recipeId); }
  return ids;
}

export default async function RecipesPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const { week } = await searchParams;
  const allDays = await getAllDays();
  const allRecipes = await getAllRecipes();
  const availableWeeks = await getAvailableWeekNumbers();
  const parsedWeek = week ? Number(week) : NaN;
  const selectedWeek = availableWeeks.includes(parsedWeek) ? parsedWeek : (availableWeeks[0] ?? 1);
  const weekIds = recipeIdsForWeek(allDays.filter((d) => weekNumberForDay(d.dayNumber) === selectedWeek));
  const weekRecipes = allRecipes.filter((r) => weekIds.has(r.id));
  const data = await getUserData();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div><Eyebrow>Week {selectedWeek}</Eyebrow><h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">Recipes</h1></div>
        <ExportButton text={formatAllRecipesForExport(weekRecipes)} label="Copy all for Notes" />
      </div>

      <div className="flex flex-wrap gap-2">
        {availableWeeks.map((w) => (
          <Link key={w} href={`/recipes?week=${w}`} className={`rounded-full px-3 py-1.5 text-xs font-medium ${selectedWeek === w ? "bg-[var(--color-ember)] text-[var(--color-ink)]" : "bg-[var(--color-surface-2)] text-[var(--color-muted)]"}`}>Week {w}</Link>
        ))}
      </div>

      {MEAL_ORDER.map((meal) => {
        const recipes = weekRecipes.filter((r) => r.meal === meal);
        if (recipes.length === 0) return null;
        return (
          <div key={meal}>
            <Eyebrow>{MEAL_LABEL[meal]}</Eyebrow>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {recipes.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                  <Card className="h-full transition-colors hover:border-[var(--color-ember)]">
                    <div className="flex items-start justify-between gap-2">
                      <div><p className="font-[family-name:var(--font-display)] text-lg tracking-wide">{recipe.name}</p><p className="mt-0.5 text-xs text-[var(--color-muted)]">{recipe.context}</p></div>
                      <FavoriteButton recipeId={recipe.id} isFavorite={data.favorites.includes(recipe.id)} />
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-[var(--color-muted)]"><StatNumber value={recipe.caloriesPerServing} unit="kcal" /><StatNumber value={recipe.proteinPerServing} unit="g protein" />{recipe.vegetarian && <Pill tone="success">Veg</Pill>}</div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
