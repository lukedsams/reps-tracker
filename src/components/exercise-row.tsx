"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, Timer as TimerIcon } from "lucide-react";
import { lookupExercise, getYouTubeEmbedId } from "@/lib/exercises";
import { Modal } from "@/components/modal";
import { TimerWidget } from "@/components/timer-widget";

export function ExerciseRow({ part, movement, logValue, onLogChange }: { part: string; movement: string; logValue?: number; onLogChange?: (value: number) => void; }) {
  const [showCues, setShowCues] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const info = lookupExercise(movement.replace(/\*$/, ""));

  return (
    <li className="flex flex-col gap-1.5 border-b border-[var(--color-border)] py-2 last:border-none">
      <div className="flex items-center gap-2">
        <span className="w-20 shrink-0 text-sm text-[var(--color-muted)]">{part}</span>
        <span className="flex-1 text-sm">{movement}</span>
        {onLogChange && (
          <input type="number" min={0} inputMode="numeric" value={logValue ?? ""} onChange={(e) => onLogChange(e.target.value === "" ? 0 : Number(e.target.value))} placeholder={info?.isTimed ? "sec" : "reps"} aria-label={`${movement} ${info?.isTimed ? "seconds" : "reps"} completed`} className="w-14 shrink-0 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-1 text-center text-xs text-[var(--color-bone)]" />
        )}
        {info?.isTimed && (
          <button onClick={() => setShowTimer(true)} className="flex items-center gap-1 rounded-full bg-[var(--color-surface-2)] px-2.5 py-1 text-xs text-[var(--color-gold)]"><TimerIcon className="h-3 w-3" />{info.defaultSeconds}s</button>
        )}
        {info && (
          <button onClick={() => setShowCues((v) => !v)} className="text-[var(--color-muted)]" aria-label="Show form cues"><ChevronDown className={`h-4 w-4 transition-transform ${showCues ? "rotate-180" : ""}`} /></button>
        )}
      </div>
      {showCues && info && (
        <div className="ml-[5.5rem] rounded-lg bg-[var(--color-surface-2)] p-3 text-xs">
          <ul className="mb-3 flex flex-col gap-1 text-[var(--color-muted)]">{info.cues.map((cue, i) => (<li key={i} className="flex gap-1.5"><span className="text-[var(--color-ember)]">&bull;</span>{cue}</li>))}</ul>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <iframe src={`https://www.youtube.com/embed/${getYouTubeEmbedId(info.link.url)}`} title={`${movement} form video`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
          </div>
          <a href={info.link.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[var(--color-gold)]">Open on YouTube<ExternalLink className="h-3 w-3" /></a>
        </div>
      )}
      <Modal open={showTimer} onClose={() => setShowTimer(false)} title={movement}><TimerWidget seconds={info?.defaultSeconds ?? 30} compact={false} /></Modal>
    </li>
  );
}
