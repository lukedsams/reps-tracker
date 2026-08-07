"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";
import { toggleFavorite } from "@/lib/actions";

export function FavoriteButton({ recipeId, isFavorite, size = "md" }: { recipeId: string; isFavorite: boolean; size?: "sm" | "md" }) {
  const [isPending, startTransition] = useTransition();
  const dim = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button type="button" disabled={isPending} onClick={(e) => { e.preventDefault(); startTransition(() => { toggleFavorite(recipeId); }); }} aria-pressed={isFavorite} aria-label={isFavorite ? "Remove favorite" : "Mark as favorite"} className="shrink-0 rounded-full p-1 transition-transform hover:scale-110 disabled:opacity-60">
      <Star className={dim} fill={isFavorite ? "var(--color-gold)" : "none"} stroke={isFavorite ? "var(--color-gold)" : "var(--color-muted)"} strokeWidth={2} />
    </button>
  );
}
