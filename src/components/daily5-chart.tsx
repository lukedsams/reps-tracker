"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Daily5Aggregate } from "@/lib/gamification";

const COLORS: Record<string, string> = { Workout: "var(--color-ember)", Protein: "var(--color-success)", Calories: "var(--color-gold)", Water: "#5aa9d6", Gratitude: "#c77dff" };

export function Daily5Chart({ stats }: { stats: Daily5Aggregate }) {
  const data = [
    { name: "Workout", count: stats.workout },
    { name: "Protein", count: stats.protein },
    { name: "Calories", count: stats.calories },
    { name: "Water", count: stats.water },
    { name: "Gratitude", count: stats.gratitude },
  ];

  if (stats.totalDaysLogged === 0) {
    return <p className="text-sm text-[var(--color-muted)]">No days logged yet, this fills in as you check off the Daily 5.</p>;
  }

  return (
    <div>
      <p className="mb-3 text-xs text-[var(--color-muted)]">Out of {stats.totalDaysLogged} day{stats.totalDaysLogged === 1 ? "" : "s"} logged, which habits land most and least often.</p>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <XAxis type="number" domain={[0, stats.totalDaysLogged]} stroke="var(--color-muted)" fontSize={11} />
            <YAxis type="category" dataKey="name" stroke="var(--color-muted)" fontSize={12} width={70} />
            <Tooltip contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12, color: "var(--color-bone)" }} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>{data.map((entry) => (<Cell key={entry.name} fill={COLORS[entry.name]} />))}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
