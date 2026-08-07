"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { toggleShoppingItem } from "@/lib/actions";
import { GroceryItem } from "@/lib/data";

export function ShoppingListClient({ items, checked, weekNumber }: { items: GroceryItem[]; checked: Record<string, boolean>; weekNumber: number }) {
  const [isPending, startTransition] = useTransition();
  const sections = Array.from(new Set(items.map((i) => i.section)));
  const checkedCount = items.filter((i) => checked[key(i, weekNumber)]).length;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-[var(--color-muted)]">{checkedCount} / {items.length} in the cart</p>
      {sections.map((section) => (
        <div key={section}>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">{section}</p>
          <ul className="flex flex-col gap-1.5">
            {items.filter((i) => i.section === section).map((item) => {
              const k = key(item, weekNumber);
              const isChecked = Boolean(checked[k]);
              return (
                <li key={k}>
                  <button disabled={isPending} onClick={() => startTransition(() => { toggleShoppingItem(k); })} className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-60 ${isChecked ? "border-[var(--color-border)] bg-transparent opacity-50" : "border-[var(--color-border)] bg-[var(--color-surface-2)]"}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${isChecked ? "border-[var(--color-success)] bg-[var(--color-success)]" : "border-[var(--color-muted)]"}`}>
                      {isChecked && <Check className="h-3.5 w-3.5 text-[var(--color-ink)]" strokeWidth={3} />}
                    </span>
                    <span className={isChecked ? "line-through" : ""}>{item.label}</span>
                    {item.qty && <span className="ml-auto shrink-0 text-xs text-[var(--color-muted)]">{item.qty}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function key(item: GroceryItem, weekNumber: number) {
  return `${weekNumber}|${item.section}|${item.label}`;
}
