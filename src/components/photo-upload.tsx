"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, Upload } from "lucide-react";
import { uploadProgressPhoto } from "@/lib/actions";
import { todayISO } from "@/lib/gamification";

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > MAX_DIMENSION) { height = Math.round((height * MAX_DIMENSION) / width); width = MAX_DIMENSION; }
      else if (height > MAX_DIMENSION) { width = Math.round((width * MAX_DIMENSION) / height); height = MAX_DIMENSION; }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unavailable"));
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))), "image/jpeg", JPEG_QUALITY);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function PhotoUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pose, setPose] = useState<"front" | "side" | "back" | "other">("front");
  const [date, setDate] = useState(todayISO());
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    startTransition(async () => {
      try {
        const resized = await resizeImage(file);
        setPreview(URL.createObjectURL(resized));
        const formData = new FormData();
        formData.append("file", resized, "photo.jpg");
        formData.append("date", date);
        formData.append("pose", pose);
        const result = await uploadProgressPhoto(formData);
        if (result?.error) setError(result.error);
      } catch {
        setError("Couldn't process that image, try a different photo.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-xs text-[var(--color-muted)]">Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-bone)]" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-[var(--color-muted)]">Pose
          <select value={pose} onChange={(e) => setPose(e.target.value as typeof pose)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-bone)]">
            <option value="front">Front</option>
            <option value="side">Side</option>
            <option value="back">Back</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); e.target.value = ""; }} />
      <button onClick={() => fileInputRef.current?.click()} disabled={isPending} className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-6 text-sm text-[var(--color-muted)] disabled:opacity-60">
        {isPending ? "Uploading..." : (<><Camera className="h-4 w-4" />Take or choose a photo<Upload className="h-4 w-4" /></>)}
      </button>
      {preview && !isPending && <img src={preview} alt="" className="h-20 w-20 rounded-lg object-cover opacity-70" />}
      {error && <p className="text-xs text-[var(--color-ember)]">{error}</p>}
      <p className="text-xs text-[var(--color-muted)]">Resized and compressed on your device before it uploads. Stored in private Blob storage, never a public URL.</p>
    </div>
  );
}
