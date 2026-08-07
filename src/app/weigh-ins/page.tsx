import { getUserData } from "@/lib/store";
import { Card, Eyebrow, StatNumber } from "@/components/ui";
import { WeighInForm } from "@/components/weigh-in-form";
import { WeightChart } from "@/components/weight-chart";

export default async function WeighInsPage() {
  const data = await getUserData();
  const entries = data.weighIns;
  const latest = entries[entries.length - 1];
  const change = latest ? latest.weight - data.baselineWeight : 0;
  const weeklyRate = computeWeeklyRate(entries);

  return (
    <div className="flex flex-col gap-6">
      <div><Eyebrow>Weigh-Ins</Eyebrow><h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">Weight Trend</h1></div>
      <Card><Eyebrow>Log today</Eyebrow><WeighInForm /></Card>
      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-6">
          <div><Eyebrow>Baseline</Eyebrow><StatNumber value={data.baselineWeight} unit="lb" className="text-xl" /></div>
          {latest && (<div><Eyebrow>Latest</Eyebrow><StatNumber value={latest.weight} unit="lb" className="text-xl" /></div>)}
          {latest && (<div><Eyebrow>Change vs. baseline</Eyebrow><StatNumber value={`${change > 0 ? "+" : ""}${change.toFixed(1)}`} unit="lb" className="text-xl" /></div>)}
        </div>
        <WeightChart weighIns={entries} baseline={data.baselineWeight} />
      </Card>
      <Card>
        <Eyebrow>Recalibration rule</Eyebrow>
        <p className="text-sm text-[var(--color-muted)]">{entries.length < 2 ? "Log at least 2-3 weigh-ins to see a trend, same day and time each week works best." : weeklyRate === null ? "Not enough spread yet to estimate a weekly rate." : `Trending about ${Math.abs(weeklyRate).toFixed(2)} lb/${weeklyRate < 0 ? "week loss" : "week gain"}. ${recalibrationNote(weeklyRate)}`}</p>
      </Card>
    </div>
  );
}

function computeWeeklyRate(entries: { date: string; weight: number }[]) {
  if (entries.length < 2) return null;
  const first = entries[0];
  const last = entries[entries.length - 1];
  const days = (new Date(last.date).getTime() - new Date(first.date).getTime()) / 86400000;
  if (days < 3) return null;
  const totalChange = last.weight - first.weight;
  return (totalChange / days) * 7;
}

function recalibrationNote(weeklyRate: number) {
  if (weeklyRate < -1) { return "Faster than the guide's ~1 lb/week target, per the recalibration rule that's a signal to add back 150-200 kcal."; }
  if (Math.abs(weeklyRate) < 0.15) { return "Roughly flat. If this holds for 3+ weeks, the recalibration rule says cut 150-200 kcal further."; }
  return "Within the expected range, no change called for yet.";
}
