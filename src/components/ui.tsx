export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (<div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 ${className}`}>{children}</div>);
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (<p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">{children}</p>);
}

export function StatNumber({ value, unit, className = "" }: { value: string | number; unit?: string; className?: string }) {
  return (<span className={`font-[family-name:var(--font-data)] tabular-nums ${className}`}>{value}{unit && <span className="ml-1 text-sm text-[var(--color-muted)]">{unit}</span>}</span>);
}

export function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "ember" | "gold" | "success" }) {
  const toneClass = { default: "bg-[var(--color-surface-2)] text-[var(--color-muted)]", ember: "bg-[var(--color-ember-dim)] text-[#ffd7c2]", gold: "bg-[#4a3c14] text-[var(--color-gold)]", success: "bg-[#1f3d2a] text-[var(--color-success)]" }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClass}`}>{children}</span>;
}
