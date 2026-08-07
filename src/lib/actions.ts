"use server";

import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { getUserData, saveUserData, ChecklistDay, JournalEntry, DrinkType, MealCompletion, ExerciseLog } from "./store";
import { todayISO, computeMealIntake, calorieGoalHit, proteinGoalHit, gratitudeComplete } from "./gamification";
import { ALL_DAYS } from "./data";

const EMPTY_DAY: ChecklistDay = { workout: false, protein: false, calories: false, water: false, gratitude: false };

export async function logWeighIn(date: string, weight: number) {
  const data = await getUserData();
  const existingIdx = data.weighIns.findIndex((w) => w.date === date);
  if (existingIdx >= 0) { data.weighIns[existingIdx].weight = weight; } else { data.weighIns.push({ date, weight }); }
  data.weighIns.sort((a, b) => a.date.localeCompare(b.date));
  await saveUserData(data);
  revalidatePath("/", "layout");
}

export async function toggleChecklistItem(date: string, habit: keyof ChecklistDay) {
  const data = await getUserData();
  const day = data.checklist[date] ?? { ...EMPTY_DAY };
  day[habit] = !day[habit];
  data.checklist[date] = day;
  await saveUserData(data);
  revalidatePath("/", "layout");
}

export async function toggleFavorite(recipeId: string) {
  const data = await getUserData();
  const idx = data.favorites.indexOf(recipeId);
  if (idx >= 0) { data.favorites.splice(idx, 1); } else { data.favorites.push(recipeId); }
  await saveUserData(data);
  revalidatePath("/", "layout");
}

export async function toggleShoppingItem(key: string) {
  const data = await getUserData();
  data.shoppingChecked[key] = !data.shoppingChecked[key];
  await saveUserData(data);
  revalidatePath("/", "layout");
}

export async function uploadProgressPhoto(formData: FormData) {
  const file = formData.get("file") as File | null;
  const date = (formData.get("date") as string) || todayISO();
  const pose = (formData.get("pose") as string) || "other";
  if (!file || file.size === 0) { return { error: "No file received" }; }
  if (!process.env.BLOB_READ_WRITE_TOKEN) { return { error: "Photo storage isn't connected yet, add Vercel Blob first (see README)." }; }

  const id = crypto.randomUUID();
  const ext = file.type === "image/png" ? "png" : "jpg";
  const pathname = `progress-photos/${id}.${ext}`;
  const blob = await put(pathname, file, { access: "private", contentType: file.type });

  const data = await getUserData();
  data.photos.push({ id, date, pose: pose as "front" | "side" | "back" | "other", pathname: blob.pathname, contentType: file.type });
  data.photos.sort((a, b) => a.date.localeCompare(b.date));
  await saveUserData(data);
  revalidatePath("/photos");
  return { ok: true };
}

export async function deleteProgressPhoto(id: string) {
  const data = await getUserData();
  const photo = data.photos.find((p) => p.id === id);
  if (!photo) return;
  if (process.env.BLOB_READ_WRITE_TOKEN) { try { await del(photo.pathname); } catch { } }
  data.photos = data.photos.filter((p) => p.id !== id);
  await saveUserData(data);
  revalidatePath("/photos");
}

export async function saveJournalEntry(entry: JournalEntry) {
  const data = await getUserData();
  data.journal[entry.date] = entry;
  const existing = data.checklist[entry.date] ?? { ...EMPTY_DAY };
  data.checklist[entry.date] = { ...existing, gratitude: gratitudeComplete(entry) };
  await saveUserData(data);
  revalidatePath("/", "layout");
  revalidatePath("/journal");
  revalidatePath("/day/" + entry.date);
  revalidatePath("/calendar");
  revalidatePath("/progress");
}

export async function logDrink(date: string, type: DrinkType, count: number) {
  const data = await getUserData();
  data.drinks.push({ id: crypto.randomUUID(), date, type, count });
  await saveUserData(data);
  revalidatePath("/progress");
  revalidatePath("/");
}

export async function deleteDrink(id: string) {
  const data = await getUserData();
  data.drinks = data.drinks.filter((d) => d.id !== id);
  await saveUserData(data);
  revalidatePath("/progress");
  revalidatePath("/");
}

export type DayEntryPayload = { date: string; workout: boolean; water: boolean; creatine: boolean; meals: MealCompletion; exerciseLog: ExerciseLog; };

export async function saveDayEntry(payload: DayEntryPayload) {
  const data = await getUserData();
  const workoutDay = ALL_DAYS.find((d) => d.date === payload.date);
  const { calories, protein, mealsCompleted } = computeMealIntake(payload.date, payload.meals);
  const existing = data.checklist[payload.date] ?? { workout: false, protein: false, calories: false, water: false, gratitude: false };
  const journalEntry = data.journal[payload.date];
  const gratitudeDone = Boolean(journalEntry && journalEntry.gratitudes.filter((g) => g.trim().length > 0).length === 5);

  const day: ChecklistDay = {
    workout: payload.workout,
    water: payload.water,
    gratitude: gratitudeDone,
    creatine: payload.creatine,
    protein: mealsCompleted === 4 && workoutDay ? proteinGoalHit(protein, workoutDay.estProtein) : existing.protein,
    calories: mealsCompleted === 4 && workoutDay ? calorieGoalHit(calories, workoutDay.estCalories) : existing.calories,
  };

  data.checklist[payload.date] = day;
  data.meals[payload.date] = payload.meals;
  data.exerciseLogs[payload.date] = payload.exerciseLog;
  data.submittedDays[payload.date] = true;

  await saveUserData(data);
  revalidatePath("/", "layout");
  revalidatePath("/day/" + payload.date);
  revalidatePath("/calendar");
  revalidatePath("/progress");
  revalidatePath("/journal");
}

export async function migrateDay2JournalToDay1() {
  const data = await getUserData();
  const day1 = "2026-07-13";
  const day2 = "2026-07-14";
  const src = data.journal[day2];
  const hasContent = Boolean(src && (src.gratitudes.some((g) => g.trim().length > 0) || src.freeWrite.trim().length > 0 || (src.ratings && Object.keys(src.ratings).length > 0)));
  if (hasContent && src) {
    data.journal[day1] = { ...src, date: day1 };
    data.journal[day2] = { date: day2, gratitudes: ["", "", "", "", ""], freeWrite: "", ratings: {} };
    await saveUserData(data);
  }
  revalidatePath("/journal");
  revalidatePath("/day/" + day1);
  revalidatePath("/day/" + day2);
  revalidatePath("/calendar");
  return { ok: true, migrated: hasContent };
}
