import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getAllRecipes } from "@/lib/weeks-store";
import { getUserData } from "@/lib/store";
import { Card, Eyebrow, Pill, StatNumber } from "@/components/ui";
import { FavoriteButton } from "@/components/favorite-button";
import { ExportButton } from "@/components/export-button";
import { formatRecipeForExport } from "@/lib/export";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allRecipes = await getAllRecipes();
  const recipe = allRecipes.find((r) => r.id === id);
  if (!recipe) notFound();
  const data = await getUserData();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/recipes" className="flex w-fit items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-bone)]"><ChevronLeft className="h-4 w-4" /> All recipes</Link>
      <div className="flex items-start justify-between gap-3">
        <div><Eyebrow>{recipe.context}</Eyebrow><h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">{recipe.name}</h1></div>
        <FavoriteButton recipeId={recipe.id} isFavorite={data.favorites.includes(recipe.id)} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Pill>{recipe.servings} serving{recipe.servings > 1 ? "s" : ""}</Pill>
        <Pill tone="ember"><StatNumber value={recipe.caloriesPerServing} unit="kcal / serving" /></Pill>
        <Pill tone="success"><StatNumber value={recipe.proteinPerServing} unit="g protein / serving" /></Pill>
        {recipe.vegetarian && <Pill>Vegetarian</Pill>}
        <ExportButton text={formatRecipeForExport(recipe)} />
      </div>
      <Card><Eyebrow>Ingredients</Eyebrow><ul className="flex flex-col gap-1.5 text-sm">{recipe.ingredients.map((ing, i) => (<li key={i} className="flex gap-2"><span className="text-[var(--color-ember)]">&bull;</span>{ing}</li>))}</ul></Card>
      <Card><Eyebrow>Instructions</Eyebrow><ol className="flex flex-col gap-3 text-sm">{recipe.instructions.map((step, i) => (<li key={i} className="flex gap-3"><span className="font-[family-name:var(--font-data)] text-[var(--color-gold)]">{String(i + 1).padStart(2, "0")}</span><span>{step}</span></li>))}</ol></Card>
      {recipe.notes && <p className="text-sm text-[var(--color-muted)]">{recipe.notes}</p>}
    </div>
  );
}
