import { NextRequest, NextResponse } from "next/server";
import { getAllDays, getUsedRecipeContext, saveGeneratedWeek } from "@/lib/weeks-store";
import { workoutSetForWeek, TARGETS, Recipe, WorkoutDay, GroceryItem } from "@/lib/data";

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHORT_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const VEG_DAYS = new Set(["Thursday", "Sunday"]);
const FOCUS_TITLE: Record<string, string> = {
  Monday: "FOCUS: LEGS", Tuesday: "FOCUS: ARMS/CHEST", Wednesday: "REST DAY",
  Thursday: "FOCUS: ABS", Friday: "FOCUS: BACK", Saturday: "FULL BODY", Sunday: "REST DAY",
};

function addDays(dateISO: string, n: number): string {
  const d = new Date(dateISO + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");
}

type GeneratedMealSpec = {
  name: string;
  servings: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  ingredients: string[];
  instructions: string[];
  notes: string;
};

type GeneratedDinnerSpec = GeneratedMealSpec & { day: string; vegetarian?: boolean };

type ClaudeWeekResponse = {
  lunchWeekday: GeneratedMealSpec;
  lunchWeekend: GeneratedMealSpec;
  dinners: GeneratedDinnerSpec[];
  groceryList: { section: string; label: string; qty: string }[];
};

async function callClaude(weekNumber: number): Promise<ClaudeWeekResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set in this Vercel project's environment variables");

  const usedRecipes = await getUsedRecipeContext();
  const remainingCalories = TARGETS.calories - 327 - 205;
  const remainingProtein = TARGETS.protein - 34 - 42;

  const prompt = "You are generating one week (Week " + weekNumber + ") of meal content for a 100-day body recomposition program.\n\n" +
    "PROGRAM TARGETS: approximately " + TARGETS.calories + " kcal/day and " + TARGETS.protein + "g protein/day, " + TARGETS.waterGallons + " gallon water/day (already tracked, don't include water in recipes).\n" +
    "FIXED DAILY STAPLES (already exist, do not generate these): Breakfast = Egg Muffins (327 kcal, 34g protein). Snack = Chocolate Protein Shake (205 kcal, 42g protein).\n" +
    "So lunch + dinner combined should land roughly " + remainingCalories + " kcal and " + remainingProtein + "g protein per day, with natural day-to-day variance being fine (not required to hit exactly).\n\n" +
    "MEAL STRUCTURE:\n" +
    "- ONE lunch recipe for Monday-Friday: batch-cooked, 5 servings, reheated daily.\n" +
    "- ONE lunch recipe for Saturday-Sunday: fresh-cooked, 2 servings.\n" +
    "- SEVEN dinner recipes, one per day Monday through Sunday, 2 servings each, fresh-cooked.\n" +
    "- Thursday and Sunday dinners MUST be vegetarian: true.\n" +
    "- Vary the protein source across the week (beef, chicken, pork, fish, turkey, or vegetarian). Avoid repeating the same primary protein on back-to-back days.\n" +
    "- Standard home kitchen equipment only (skillet, oven, pot). No special appliances.\n\n" +
    "DO NOT REPEAT any of these recipes already used in prior weeks, by name or by near-identical concept: " + (usedRecipes || "none yet, this is the first generated week") + ".\n\n" +
    "Respond with ONLY valid JSON. No markdown code fences, no preamble, no explanation before or after the JSON. Match this exact shape:\n\n" +
    "{\n" +
    '  "lunchWeekday": { "name": string, "servings": 5, "caloriesPerServing": number, "proteinPerServing": number, "ingredients": string[], "instructions": string[], "notes": string },\n' +
    '  "lunchWeekend": { "name": string, "servings": 2, "caloriesPerServing": number, "proteinPerServing": number, "ingredients": string[], "instructions": string[], "notes": string },\n' +
    '  "dinners": [\n' +
    '    { "day": "Monday", "name": string, "servings": 2, "caloriesPerServing": number, "proteinPerServing": number, "ingredients": string[], "instructions": string[], "notes": string, "vegetarian": false },\n' +
    '    { "day": "Tuesday", "...": "same shape" },\n' +
    '    { "day": "Wednesday", "...": "same shape" },\n' +
    '    { "day": "Thursday", "...": "same shape", "vegetarian": true },\n' +
    '    { "day": "Friday", "...": "same shape" },\n' +
    '    { "day": "Saturday", "...": "same shape" },\n' +
    '    { "day": "Sunday", "...": "same shape", "vegetarian": true }\n' +
    "  ],\n" +
    '  "groceryList": [ { "section": "Protein" | "Produce" | "Grains / Pantry" | "Dairy" | "Seasoning check", "label": string, "qty": string } ]\n' +
    "}\n\n" +
    "The groceryList should be a consolidated shopping list covering all 9 new recipes' ingredients for the week, organized by section, with realistic grocery-store quantities (e.g. \"1.5 lb\", \"2 medium\", \"1 can (15 oz)\") sized with practical surplus like a real shopping list, not lab-precise portions.";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Claude API error " + response.status + ": " + text.slice(0, 500));
  }

  const data = await response.json();
  const blocks = (data.content ?? []) as { type: string; text?: string }[];
  const textBlock = blocks.find((b) => b.type === "text");
  if (!textBlock?.text) throw new Error("No text content in Claude response");

  let cleaned = textBlock.text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

  let parsed: ClaudeWeekResponse;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse Claude JSON response: " + cleaned.slice(0, 300));
  }

  if (!parsed.lunchWeekday || !parsed.lunchWeekend || !Array.isArray(parsed.dinners) || parsed.dinners.length !== 7 || !Array.isArray(parsed.groceryList)) {
    throw new Error("Claude response missing required fields");
  }

  return parsed;
}

function buildWeek(weekNumber: number, startDate: string, startDayNumber: number, generated: ClaudeWeekResponse): { days: WorkoutDay[]; recipes: Recipe[]; groceryList: GroceryItem[] } {
  const workoutSet = workoutSetForWeek(weekNumber);
  const weekSuffix = "w" + weekNumber;
  const recipes: Recipe[] = [];

  const lunchWeekdayId = slugify(generated.lunchWeekday.name) + "-" + weekSuffix;
  const lunchWeekendId = slugify(generated.lunchWeekend.name) + "-" + weekSuffix;

  const lunchWeekdayRecipe: Recipe = {
    id: lunchWeekdayId, name: generated.lunchWeekday.name, meal: "lunch",
    context: "Monday through Friday, Week " + weekNumber + " (batch cook once)",
    servings: generated.lunchWeekday.servings || 5,
    caloriesPerServing: Number(generated.lunchWeekday.caloriesPerServing) || 0,
    proteinPerServing: Number(generated.lunchWeekday.proteinPerServing) || 0,
    ingredients: generated.lunchWeekday.ingredients ?? [],
    instructions: generated.lunchWeekday.instructions ?? [],
    notes: generated.lunchWeekday.notes ?? "",
  };
  const lunchWeekendRecipe: Recipe = {
    id: lunchWeekendId, name: generated.lunchWeekend.name, meal: "lunch",
    context: "Saturday and Sunday, Week " + weekNumber,
    servings: generated.lunchWeekend.servings || 2,
    caloriesPerServing: Number(generated.lunchWeekend.caloriesPerServing) || 0,
    proteinPerServing: Number(generated.lunchWeekend.proteinPerServing) || 0,
    ingredients: generated.lunchWeekend.ingredients ?? [],
    instructions: generated.lunchWeekend.instructions ?? [],
    notes: generated.lunchWeekend.notes ?? "",
  };
  recipes.push(lunchWeekdayRecipe, lunchWeekendRecipe);

  const dinnerByDay = new Map(generated.dinners.map((d) => [d.day, d]));

  const days: WorkoutDay[] = DAY_LABELS.map((label, i) => {
    const date = addDays(startDate, i);
    const dayNumber = startDayNumber + i;
    const shortLabel = SHORT_LABELS[i];
    const isRest = label === "Wednesday" || label === "Sunday";
    const isShoppingDay = label === "Sunday";
    const isPrepDay = label === "Sunday";

    const dinnerSpec = dinnerByDay.get(label);
    if (!dinnerSpec) throw new Error("Missing dinner spec for " + label);
    const dinnerId = slugify(dinnerSpec.name) + "-" + weekSuffix;
    const isVeg = dinnerSpec.vegetarian ?? VEG_DAYS.has(label);
    const restSuffix = isRest ? " (rest day)" : "";
    const vegSuffix = isVeg ? ", vegetarian" : "";

    const dinnerRecipe: Recipe = {
      id: dinnerId, name: dinnerSpec.name, meal: "dinner",
      context: label + ", Week " + weekNumber + restSuffix + vegSuffix,
      servings: dinnerSpec.servings || 2,
      caloriesPerServing: Number(dinnerSpec.caloriesPerServing) || 0,
      proteinPerServing: Number(dinnerSpec.proteinPerServing) || 0,
      ingredients: dinnerSpec.ingredients ?? [],
      instructions: dinnerSpec.instructions ?? [],
      notes: dinnerSpec.notes ?? "",
      vegetarian: isVeg || undefined,
    };
    recipes.push(dinnerRecipe);

    const lunchRecipe = (label === "Saturday" || label === "Sunday") ? lunchWeekendRecipe : lunchWeekdayRecipe;
    const workoutInfo = workoutSet[label];

    const breakfastCal = 327, breakfastPro = 34, snackCal = 205, snackPro = 42;
    const estCalories = breakfastCal + snackCal + lunchRecipe.caloriesPerServing + dinnerRecipe.caloriesPerServing;
    const estProtein = breakfastPro + snackPro + lunchRecipe.proteinPerServing + dinnerRecipe.proteinPerServing;

    return {
      date, dayNumber, dayLabel: label, shortLabel,
      focusTitle: FOCUS_TITLE[label],
      isRest, isShoppingDay, isPrepDay,
      prepNote: isShoppingDay ? "Shopping + prep day. Buy next week's groceries and batch-cook next week's lunch + egg muffins so Monday's breakfast and lunch are ready." : undefined,
      exercises: workoutInfo?.exercises ?? [],
      focusSet: workoutInfo?.focusSet,
      restNote: isRest ? (isShoppingDay ? "Optional light movement. Also your weekly shopping + batch-prep day: cook next week's Mon-Fri lunch + egg muffins today." : "Optional light movement: walk, stretch, mobility work. This is recovery, not a day off from eating well.") : undefined,
      estCalories, estProtein,
      meals: {
        breakfast: { name: "Egg Muffins (2)", recipeId: "egg-muffins" },
        snack: { name: "Protein Shake", recipeId: "protein-shake" },
        lunch: { name: lunchRecipe.name, recipeId: lunchRecipe.id },
        dinner: { name: dinnerRecipe.name, recipeId: dinnerRecipe.id },
      },
    };
  });

  const groceryList: GroceryItem[] = generated.groceryList.map((g) => ({
    section: g.section || "Other",
    label: g.label || "Item",
    qty: g.qty || "",
  }));

  return { days, recipes, groceryList };
}

async function handleGenerate(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== "Bearer " + secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const allDays = await getAllDays();
    const maxDayNumber = Math.max(...allDays.map((d) => d.dayNumber));
    const nextWeekNumber = Math.floor(maxDayNumber / 7) + 1;
    const lastDay = allDays.find((d) => d.dayNumber === maxDayNumber);
    if (!lastDay) throw new Error("Could not find the latest existing day");
    const startDate = addDays(lastDay.date, 1);
    const startDayNumber = maxDayNumber + 1;

    const generated = await callClaude(nextWeekNumber);
    const week = buildWeek(nextWeekNumber, startDate, startDayNumber, generated);
    await saveGeneratedWeek({ weekNumber: nextWeekNumber, days: week.days, recipes: week.recipes, groceryList: week.groceryList, generatedAt: new Date().toISOString() });

    return NextResponse.json({
      ok: true,
      weekNumber: nextWeekNumber,
      startDate,
      dinners: week.recipes.filter((r) => r.meal === "dinner").map((r) => r.name),
      lunches: week.recipes.filter((r) => r.meal === "lunch").map((r) => r.name),
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return handleGenerate(request);
}

export async function GET(request: NextRequest) {
  return handleGenerate(request);
}
