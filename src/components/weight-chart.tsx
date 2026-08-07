"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from "recharts";
import { WeighIn } from "@/lib/store";

export function WeightChart({ weighIns, baseline }: { weighIns: WeighIn[]; baseline: number }) {
  if (weighIns.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">No weigh-ins logged yet. Your first entry starts the trend line.</p>;
  }

  const chartData = weighIns.map((w) => ({ date: w.date.slice(5), weight: w.weight }));
  const weights = weighIns.map((w) => w.weight).concat(baseline);
  const min = Math.floor(Math.min(...weights) - 2);
  const max = Math.ceil(Math.max(...weights) + 2);

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="date" stroke="var(--color-muted)" fontSize={11} />
          <YAxis domain={[min, max]} stroke="var(--color-muted)" fontSize={11} />
          <Tooltip contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12, color: "var(--color-bone)" }} />
          <ReferenceLine y={baseline} stroke="var(--color-muted)" strokeDasharray="4 4" label={{ value: "baseline", position: "insideTopLeft", fill: "var(--color-muted)", fontSize: 10 }} />
          <Line type="monotone" dataKey="weight" stroke="var(--color-ember)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-ember)" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
