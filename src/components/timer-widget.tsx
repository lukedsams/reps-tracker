"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimer, TimerMode } from "@/lib/use-timer";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TimerWidget({ mode: initialMode = "countdown", seconds = 30, label, compact = false }: { mode?: TimerMode; seconds?: number; label?: string; compact?: boolean }) {
  const [mode, setMode] = useState<TimerMode>(initialMode);
  const [duration, setDuration] = useState(seconds);
  const timer = useTimer(mode, duration);
  const display = mode === "countdown" ? timer.remaining : timer.elapsed;

  return (
    <div className={compact ? "" : "flex flex-col items-center gap-6"}>
      {!compact && (
        <div className="flex gap-2 rounded-full bg-[var(--color-surface-2)] p-1">
          {(["countdown", "stopwatch"] as TimerMode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); timer.reset(); }} className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${mode === m ? "bg-[var(--color-ember)] text-[var(--color-ink)]" : "text-[var(--color-muted)]"}`}>{m}</button>
          ))}
        </div>
      )}
      {label && <p className="text-sm text-[var(--color-muted)]">{label}</p>}
      <div className={`font-[family-name:var(--font-data)] tabular-nums ${timer.done ? "text-[var(--color-gold)]" : "text-[var(--color-bone)]"} ${compact ? "text-4xl" : "text-7xl"}`}>{formatTime(display)}</div>
      {timer.done && <p className="text-sm font-medium text-[var(--color-gold)]">Time&apos;s up</p>}
      {mode === "countdown" && !compact && (
        <div className="flex flex-wrap justify-center gap-2">
          {[10, 20, 30, 45, 60].map((preset) => (
            <button key={preset} onClick={() => { setDuration(preset); timer.reset(); }} className={`rounded-full border px-3 py-1.5 text-xs ${duration === preset ? "border-[var(--color-ember)] text-[var(--color-ember)]" : "border-[var(--color-border)] text-[var(--color-muted)]"}`}>{preset}s</button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button onClick={timer.running ? timer.pause : timer.start} className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-ember)] text-[var(--color-ink)]" aria-label={timer.running ? "Pause" : "Start"}>
          {timer.running ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-0.5" />}
        </button>
        <button onClick={timer.reset} className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)]" aria-label="Reset">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
