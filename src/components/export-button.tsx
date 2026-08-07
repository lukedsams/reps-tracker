"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function ExportButton({ text, label = "Copy for Notes" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-full bg-[var(--color-surface-2)] px-3 py-1.5 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-bone)]">
      {copied ? (<><Check className="h-3.5 w-3.5 text-[var(--color-success)]" /> Copied</>) : (<><Copy className="h-3.5 w-3.5" /> {label}</>)}
    </button>
  );
}
