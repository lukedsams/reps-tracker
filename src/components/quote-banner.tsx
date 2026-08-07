import { Quote } from "lucide-react";

export function QuoteBanner({ quote }: { quote: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <Quote className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold)]" />
      <p className="text-sm italic text-[var(--color-bone)]">{quote}</p>
    </div>
  );
}
