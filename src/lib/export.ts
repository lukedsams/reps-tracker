import { GroceryItem, Recipe } from "./data";

export function formatGroceryListForExport(items: GroceryItem[]): string {
  const sections = Array.from(new Set(items.map((i) => i.section)));
  const lines: string[] = ["WEEK 1 GROCERY LIST", ""];
  for (const section of sections) {
    lines.push(section.toUpperCase());
    for (const item of items.filter((i) => i.section === section)) { lines.push(`[ ] ${item.label}${item.qty ? ` — ${item.qty}` : ""}`); }
    lines.push("");
  }
  return lines.join("\n").trim();
}

export function formatRecipeForExport(recipe: Recipe): string {
  const lines: string[] = [recipe.name.toUpperCase(), recipe.context, `Servings: ${recipe.servings} · ${recipe.caloriesPerServing} kcal · ${recipe.proteinPerServing}g protein`, "", "INGREDIENTS"];
  for (const ing of recipe.ingredients) lines.push(`[ ] ${ing}`);
  lines.push("", "INSTRUCTIONS");
  recipe.instructions.forEach((step, i) => lines.push(`[ ] ${i + 1}. ${step}`));
  if (recipe.notes) lines.push("", `Notes: ${recipe.notes}`);
  return lines.join("\n").trim();
}

export function formatAllRecipesForExport(recipes: Recipe[]): string {
  return recipes.map((r) => formatRecipeForExport(r)).join("\n\n" + "-".repeat(24) + "\n\n");
}
