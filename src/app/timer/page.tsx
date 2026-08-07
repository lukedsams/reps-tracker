import { Card, Eyebrow } from "@/components/ui";
import { TimerWidget } from "@/components/timer-widget";

export default function TimerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div><Eyebrow>Timer</Eyebrow><h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">Rest &amp; Hold Timer</h1></div>
      <Card className="py-10"><TimerWidget seconds={30} /></Card>
      <p className="text-center text-xs text-[var(--color-muted)]">10-45 sec is the rest window between movements in the guide. Switch to stopwatch to time a hold to failure instead of a fixed count.</p>
    </div>
  );
}
