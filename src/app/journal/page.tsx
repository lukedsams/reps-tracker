import Link from "next/link";
import { getUserData } from "@/lib/store";
import { todayISO, dayNumberForDate, availableCheckpoints, correlationMatrix, averageRatings, checkpointCompletion, exerciseCorrelationMatrix, averageCircuits, RatingKey } from "@/lib/gamification";
import { Card, Eyebrow, StatNumber } from "@/components/ui";
import { JournalForm } from "@/components/journal-form";
import { MigrateDay2Button } from "@/components/migrate-day2-button";

const RATING_LABEL: Record<RatingKey, string> = { energy: "Energy", soreness: "Soreness", sleepQuality: "Sleep quality", motivation: "Motivation", anxiety: "Anxiety", aggravation: "Aggravation", confidence: "Confidence", hunger: "Hunger" };
const HABIT_LABEL: Record<string, string> = { workout: "Workout", protein: "Protein hit", calories: "Calorie range hit", water: "Water goal hit" };

export default async function JournalPage() {
  const data = await getUserData();
  const today = todayISO();
  const dayNumber = Math.max(dayNumberForDate(today), 1);
  const checkpoints = availableCheckpoints(dayNumber);

  return (
    <div className="flex flex-col gap-6">
      <div><Eyebrow>Today</Eyebrow><h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">Journal</h1></div>
      <Card><Eyebrow>Day {dayNumber}</Eyebrow><JournalForm date={today} existing={data.journal[today]} /></Card>

      {(() => {
        const day2 = data.journal["2026-07-14"];
        const hasContent = Boolean(day2 && (day2.gratitudes.some((g) => g.trim().length > 0) || day2.freeWrite.trim().length > 0 || (day2.ratings && Object.keys(day2.ratings).length > 0)));
        return hasContent ? (
          <Card className="!border-[var(--color-gold)]/50">
            <Eyebrow>One-time fix</Eyebrow>
            <p className="mb-3 text-sm text-[var(--color-muted)]">Your Day 2 gratitudes/free-write/ratings actually belong to Day 1. Click once to move them and blank Day 2.</p>
            <MigrateDay2Button />
          </Card>
        ) : null;
      })()}

      <Card><Eyebrow>Browse past entries</Eyebrow><p className="text-sm text-[var(--color-muted)]">Every entry is saved by date. Open the <Link href="/calendar" className="text-[var(--color-gold)] underline">calendar</Link> and tap any past day to read what you wrote.</p></Card>

      <div>
        <Eyebrow>Correlation analysis</Eyebrow>
        <h2 className="mb-1 font-[family-name:var(--font-display)] text-xl tracking-wide">Every 25 days</h2>
        <p className="mb-4 text-sm text-[var(--color-muted)]">Correlates your numeric ratings against your Daily 5 checkboxes (Pearson&apos;s r). Free-write text isn&apos;t included, there&apos;s no honest way to turn prose into a number. Needs at least a handful of matching days to produce a result, sparse checkpoints may show fewer rows.</p>

        {checkpoints.length === 0 ? (
          <Card><p className="text-sm text-[var(--color-muted)]">Your first checkpoint unlocks at Day 25. Keep logging ratings and Daily 5 checkboxes between now and then.</p></Card>
        ) : (
          <div className="flex flex-col gap-4">
            {checkpoints.map((cp) => (<CheckpointCard key={cp.label} label={cp.label} startDay={cp.startDay} endDay={cp.endDay} data={data} />))}
            {checkpoints.length > 1 && (
              <Card>
                <Eyebrow>Program analysis</Eyebrow>
                <h3 className="mb-3 font-[family-name:var(--font-display)] text-lg tracking-wide">Checkpoint comparison</h3>
                <CheckpointComparison checkpoints={checkpoints} data={data} />
              </Card>
            )}
            {checkpoints.length === 4 && (
              <Card className="!border-[var(--color-gold)]/50">
                <Eyebrow>Day 100</Eyebrow>
                <h3 className="mb-3 font-[family-name:var(--font-display)] text-lg tracking-wide">Total program analysis</h3>
                <p className="mb-3 text-sm text-[var(--color-muted)]">Every rating and Daily 5 checkbox across all 100 days, correlated together rather than broken into checkpoints.</p>
                <CorrelationTable results={correlationMatrix(data.checklist, data.journal, 1, 100)} />
                <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                  <Eyebrow>Circuit consistency</Eyebrow>
                  {(() => { const avgCircuits = averageCircuits(data.exerciseLogs, 1, 100); return avgCircuits !== undefined ? (<p className="mb-2 text-xs text-[var(--color-muted)]">Average circuits completed: <span className="text-[var(--color-bone)]">{avgCircuits.toFixed(1)}</span></p>) : null; })()}
                  <ExerciseCorrelationTable results={exerciseCorrelationMatrix(data.checklist, data.exerciseLogs, 1, 100)} />
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CheckpointCard({ label, startDay, endDay, data }: { label: string; startDay: number; endDay: number; data: Awaited<ReturnType<typeof getUserData>>; }) {
  const results = correlationMatrix(data.checklist, data.journal, startDay, endDay);
  const avgRatings = averageRatings(data.journal, startDay, endDay);
  const completion = checkpointCompletion(data.checklist, startDay, endDay);
  const exerciseResults = exerciseCorrelationMatrix(data.checklist, data.exerciseLogs, startDay, endDay);
  const avgCircuits = averageCircuits(data.exerciseLogs, startDay, endDay);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between"><Eyebrow>{label}</Eyebrow><StatNumber value={`${Math.round(completion.fullWinRate * 100)}%`} unit="full wins" className="text-sm" /></div>
      {Object.keys(avgRatings).length > 0 && (<div className="mb-4 flex flex-wrap gap-3 text-xs text-[var(--color-muted)]">{Object.entries(avgRatings).map(([key, value]) => (<span key={key}>{RATING_LABEL[key as RatingKey]}: <span className="text-[var(--color-bone)]">{value!.toFixed(1)}</span></span>))}</div>)}
      <CorrelationTable results={results} />
      <div className="mt-4 border-t border-[var(--color-border)] pt-4">
        <Eyebrow>Circuit consistency</Eyebrow>
        {avgCircuits !== undefined && (<p className="mb-2 text-xs text-[var(--color-muted)]">Average circuits completed: <span className="text-[var(--color-bone)]">{avgCircuits.toFixed(1)}</span></p>)}
        <ExerciseCorrelationTable results={exerciseResults} />
      </div>
    </Card>
  );
}

function ExerciseCorrelationTable({ results }: { results: { habit: string; r: number; n: number }[] }) {
  if (results.length === 0) { return (<p className="text-sm text-[var(--color-muted)]">Not enough circuit-count data yet for a correlation.</p>); }
  return (
    <ul className="flex flex-col gap-1.5 text-sm">
      {results.map((res, i) => (
        <li key={i} className="flex items-center justify-between gap-2">
          <span className="text-[var(--color-muted)]">Circuits completed &harr; {HABIT_LABEL[res.habit] ?? res.habit}</span>
          <span className={`font-[family-name:var(--font-data)] ${Math.abs(res.r) >= 0.4 ? "text-[var(--color-gold)]" : "text-[var(--color-bone)]"}`}>r = {res.r.toFixed(2)} <span className="text-[var(--color-muted)]">(n={res.n})</span></span>
        </li>
      ))}
    </ul>
  );
}

function CorrelationTable({ results }: { results: { rating: RatingKey; habit: string; r: number; n: number }[] }) {
  if (results.length === 0) { return <p className="text-sm text-[var(--color-muted)]">Not enough matching data yet for a correlation.</p>; }
  return (
    <ul className="flex flex-col gap-1.5 text-sm">
      {results.slice(0, 8).map((res, i) => (
        <li key={i} className="flex items-center justify-between gap-2">
          <span className="text-[var(--color-muted)]">{RATING_LABEL[res.rating]} &harr; {HABIT_LABEL[res.habit] ?? res.habit}</span>
          <span className={`font-[family-name:var(--font-data)] ${Math.abs(res.r) >= 0.4 ? "text-[var(--color-gold)]" : "text-[var(--color-bone)]"}`}>r = {res.r.toFixed(2)} <span className="text-[var(--color-muted)]">(n={res.n})</span></span>
        </li>
      ))}
    </ul>
  );
}

function CheckpointComparison({ checkpoints, data }: { checkpoints: readonly { label: string; startDay: number; endDay: number }[]; data: Awaited<ReturnType<typeof getUserData>>; }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead><tr className="text-[var(--color-muted)]"><th className="pb-2 pr-3">Checkpoint</th><th className="pb-2 pr-3">Full win rate</th>{Object.keys(RATING_LABEL).map((key) => (<th key={key} className="pb-2 pr-3">{RATING_LABEL[key as RatingKey]}</th>))}</tr></thead>
        <tbody>
          {checkpoints.map((cp) => {
            const completion = checkpointCompletion(data.checklist, cp.startDay, cp.endDay);
            const avg = averageRatings(data.journal, cp.startDay, cp.endDay);
            return (
              <tr key={cp.label} className="border-t border-[var(--color-border)]">
                <td className="py-2 pr-3 text-[var(--color-bone)]">{cp.label}</td>
                <td className="py-2 pr-3 font-[family-name:var(--font-data)] text-[var(--color-gold)]">{Math.round(completion.fullWinRate * 100)}%</td>
                {Object.keys(RATING_LABEL).map((key) => (<td key={key} className="py-2 pr-3 font-[family-name:var(--font-data)]">{avg[key as RatingKey] !== undefined ? avg[key as RatingKey]!.toFixed(1) : "-"}</td>))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
