"use client";

export function RatingInput({ label, value, onChange, readOnly = false }: { label: string; value: number | undefined; onChange?: (value: number) => void; readOnly?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = value !== undefined && n <= value;
          return (
            <button key={n} type="button" disabled={readOnly} onClick={() => onChange?.(n)} aria-label={`${label} ${n} out of 5`} className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-[family-name:var(--font-data)] transition-colors ${active ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-ink)]" : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]"} ${readOnly ? "cursor-default" : "hover:border-[var(--color-gold)]"}`}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
