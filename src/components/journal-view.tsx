import { JournalEntry } from "@/lib/store";
import { RatingInput } from "@/components/rating-input";

const RATING_FIELDS: { key: keyof NonNullable<JournalEntry["ratings"]>; label: string }[] = [
  { key: "energy", label: "Energy" }, { key: "soreness", label: "Soreness" }, { key: "sleepQuality", label: "Sleep quality" }, { key: "motivation", label: "Motivation" }, { key: "anxiety", label: "Anxiety" }, { key: "aggravation", label: "Aggravation" }, { key: "confidence", label: "Confidence / self-esteem" }, { key: "hunger", label: "Hunger" },
];

export function JournalView({ entry }: { entry: JournalEntry }) {
  const gratitudes = entry.gratitudes.filter((g) => g.trim().length > 0);

  return (
    <div className="flex flex-col gap-5">
      {gratitudes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">5 gratitudes</p>
          <ol className="flex flex-col gap-1 text-sm">{gratitudes.map((g, i) => (<li key={i} className="flex gap-2"><span className="font-[family-name:var(--font-data)] text-[var(--color-gold)]">{i + 1}</span>{g}</li>))}</ol>
        </div>
      )}
      {entry.freeWrite && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">Free write</p>
          <p className="whitespace-pre-wrap text-sm text-[var(--color-bone)]">{entry.freeWrite}</p>
        </div>
      )}
      {entry.ratings && Object.keys(entry.ratings).length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">Ratings</p>
          <div className="flex flex-col gap-2">{RATING_FIELDS.filter(({ key }) => entry.ratings?.[key] !== undefined).map(({ key, label }) => (<RatingInput key={key} label={label} value={entry.ratings?.[key]} readOnly />))}</div>
        </div>
      )}
    </div>
  );
}
