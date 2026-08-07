"use client";

import { useState, useTransition } from "react";
import { Trash2, GitCompare, X } from "lucide-react";
import { deleteProgressPhoto } from "@/lib/actions";
import { ProgressPhoto } from "@/lib/store";
import { Pill } from "@/components/ui";

const POSE_LABEL: Record<ProgressPhoto["pose"], string> = { front: "Front", side: "Side", back: "Back", other: "Other" };

export function PhotoGallery({ photos }: { photos: ProgressPhoto[] }) {
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  if (photos.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">No photos yet. Day 1, 30, 60, and 100, same lighting, same outfit, same pose, per the guide.</p>;
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => { if (prev.includes(id)) return prev.filter((x) => x !== id); if (prev.length >= 2) return [prev[1], id]; return [...prev, id]; });
  };

  const selectedPhotos = photos.filter((p) => selected.includes(p.id));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted)]">{photos.length} photos</p>
        <button onClick={() => { setCompareMode((v) => !v); setSelected([]); }} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${compareMode ? "bg-[var(--color-ember)] text-[var(--color-ink)]" : "bg-[var(--color-surface-2)] text-[var(--color-muted)]"}`}>
          <GitCompare className="h-3.5 w-3.5" />Compare
        </button>
      </div>

      {compareMode && (
        <div className="rounded-lg bg-[var(--color-surface-2)] p-3 text-xs text-[var(--color-muted)]">
          {selected.length < 2 ? `Pick ${2 - selected.length} more photo${2 - selected.length > 1 ? "s" : ""} to compare.` : "Showing your comparison below."}
        </div>
      )}

      {compareMode && selectedPhotos.length === 2 && (
        <div className="grid grid-cols-2 gap-3">
          {selectedPhotos.map((p) => (
            <div key={p.id}>
              <img src={`/api/photos/${p.id}`} alt={`${p.pose} ${p.date}`} className="aspect-[3/4] w-full rounded-lg object-cover" />
              <p className="mt-1 text-center text-xs text-[var(--color-muted)]">{p.date}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p) => {
          const isSelected = selected.includes(p.id);
          return (
            <div key={p.id} onClick={() => compareMode && toggleSelect(p.id)} className={`relative overflow-hidden rounded-lg border ${isSelected ? "border-[var(--color-ember)]" : "border-[var(--color-border)]"} ${compareMode ? "cursor-pointer" : ""}`}>
              <img src={`/api/photos/${p.id}`} alt={`${p.pose} progress photo, ${p.date}`} className="aspect-[3/4] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-2">
                <div>
                  <p className="text-xs text-white">{p.date}</p>
                  <Pill>{POSE_LABEL[p.pose]}</Pill>
                </div>
                {!compareMode && (
                  <button disabled={isPending} onClick={(e) => { e.stopPropagation(); startTransition(() => deleteProgressPhoto(p.id)); }} className="rounded-full bg-black/50 p-1.5 text-white" aria-label="Delete photo"><Trash2 className="h-3.5 w-3.5" /></button>
                )}
                {compareMode && isSelected && (<span className="rounded-full bg-[var(--color-ember)] p-1 text-[var(--color-ink)]"><X className="h-3 w-3" /></span>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
