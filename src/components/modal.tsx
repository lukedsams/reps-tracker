"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-t-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 pb-10 sm:rounded-2xl sm:pb-6">
        <div className="mb-4 flex items-center justify-between">
          {title && <p className="font-[family-name:var(--font-display)] text-lg tracking-wide">{title}</p>}
          <button onClick={onClose} className="ml-auto text-[var(--color-muted)]">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
