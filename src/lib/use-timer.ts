"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type TimerMode = "countdown" | "stopwatch";

function playBeep(times = 3) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    for (let i = 0; i < times; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      const start = ctx.currentTime + i * 0.28;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
      osc.start(start);
      osc.stop(start + 0.25);
    }
    setTimeout(() => ctx.close(), times * 300 + 400);
  } catch { }
}

export function useTimer(mode: TimerMode, initialSeconds: number) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    if (mode === "countdown") {
      setRemaining((r) => { if (r <= 1) { setRunning(false); setDone(true); playBeep(3); return 0; } return r - 1; });
    } else { setElapsed((e) => e + 1); }
  }, [mode]);

  useEffect(() => {
    if (running) { intervalRef.current = setInterval(tick, 1000); }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, tick]);

  const start = () => { setDone(false); setRunning(true); };
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setDone(false); setRemaining(initialSeconds); setElapsed(0); };

  return { remaining, elapsed, running, done, start, pause, reset };
}
