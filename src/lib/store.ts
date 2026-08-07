import { Redis } from "@upstash/redis";

export type ChecklistDay = { workout: boolean; protein: boolean; calories: boolean; water: boolean; gratitude: boolean; creatine?: boolean; };
export type WeighIn = { date: string; weight: number };
export type JournalEntry = { date: string; gratitudes: string[]; freeWrite: string; ratings?: { energy?: number; soreness?: number; sleepQuality?: number; motivation?: number; anxiety?: number; aggravation?: number; confidence?: number; hunger?: number; }; };
export type MealKey = "breakfast" | "snack" | "lunch" | "dinner";
export type MealCompletion = Partial<Record<MealKey, boolean>>;
export type ExerciseLog = { circuitsCompleted?: number; results?: Record<string, number>; };
export type DrinkType = "beer" | "wine";
export type DrinkEntry = { id: string; date: string; type: DrinkType; count: number; };
export type ProgressPhoto = { id: string; date: string; pose: "front" | "side" | "back" | "other"; pathname: string; contentType: string; };

export type UserData = {
  weighIns: WeighIn[];
  checklist: Record<string, ChecklistDay>;
  favorites: string[];
  shoppingChecked: Record<string, boolean>;
  baselineWeight: number;
  photos: ProgressPhoto[];
  journal: Record<string, JournalEntry>;
  drinks: DrinkEntry[];
  meals: Record<string, MealCompletion>;
  exerciseLogs: Record<string, ExerciseLog>;
  submittedDays: Record<string, boolean>;
};

const DEFAULT_DATA: UserData = { weighIns: [], checklist: {}, favorites: [], shoppingChecked: {}, baselineWeight: 178, photos: [], journal: {}, drinks: [], meals: {}, exerciseLogs: {}, submittedDays: {} };

const KEY = "reps-tracker:user-data";
const hasRedis = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
export const persistenceIsLive = hasRedis;

let redis: Redis | null = null;
if (hasRedis) { redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! }); }

const memoryStore: { data: UserData } = { data: { ...DEFAULT_DATA } };

export async function getUserData(): Promise<UserData> {
  if (redis) {
    const data = await redis.get<UserData>(KEY);
    if (!data) { await redis.set(KEY, DEFAULT_DATA); return { ...DEFAULT_DATA }; }
    return { ...DEFAULT_DATA, ...data };
  }
  return memoryStore.data;
}

export async function saveUserData(data: UserData): Promise<void> {
  if (redis) { await redis.set(KEY, data); return; }
  memoryStore.data = data;
}
