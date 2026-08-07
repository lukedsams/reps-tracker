import { ChecklistDay } from "@/lib/store";
import { dayStatus, dateForDayNumber, MILESTONES } from "@/lib/gamification";

export function ChainTracker({ checklist }: { checklist: Record<string, ChecklistDay> }) {
  const days = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div>
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {days.map((dayNumber) => {
          const date = dateForDayNumber(dayNumber);
          const status = dayStatus(date, checklist);
          const isMilestone = MILESTONES.includes(dayNumber);
          return (
            <div key={dayNumber} title={`Day ${dayNumber} — ${date}`} className="relative flex items-center justify-center">
              <Link status={status} milestone={isMilestone} />
              {isMilestone && <span className="absolute -bottom-3.5 text-[9px] text-[var(--color-muted)]">{dayNumber}</span>}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-[var(--color-muted)]">
        <Legend color="var(--color-gold)" label="Full win" />
        <Legend color="var(--color-success)" label="Minimum win" />
        <Legend color="var(--color-ember)" label="Missed" broken />
        <Legend color="var(--color-border)" label="Not there yet" />
      </div>
    </div>
  );
}

function Link({ status, milestone }: { status: "full" | "minimum" | "missed" | "future" | "unlogged"; milestone: boolean }) {
  const fill = status === "full" ? "var(--color-gold)" : status === "minimum" ? "var(--color-success)" : status === "missed" ? "var(--color-ember-dim)" : "transparent";
  const stroke = status === "missed" ? "var(--color-ember)" : status === "future" || status === "unlogged" ? "var(--color-border)" : fill;

  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 sm:h-5 sm:w-5">
      <rect x="2" y="2" width="16" height="16" rx="6" fill={fill} stroke={stroke} strokeWidth={milestone ? 2 : 1.5} strokeDasharray={status === "missed" ? "3 2" : undefined} />
      {status === "unlogged" && (<circle cx="10" cy="10" r="2.5" fill="var(--color-gold)"><animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" /></circle>)}
    </svg>
  );
}

function Legend({ color, label, broken }: { color: string; label: string; broken?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5"><rect x="2" y="2" width="16" height="16" rx="6" fill={broken ? "transparent" : color} stroke={color} strokeWidth="1.5" strokeDasharray={broken ? "3 2" : undefined} /></svg>
      {label}
    </span>
  );
}
