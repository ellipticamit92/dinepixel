"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { INSET_SM, RAISED_SM } from "@/lib/neu-shadows";

export function DishImageEnhancer({
  onGenerate,
  onApply,
}: {
  onGenerate: (count: number) => Promise<string[]>;
  onApply: (url: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [applyingUrl, setApplyingUrl] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setImages([]);
    try {
      setImages(await onGenerate(count));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't generate images");
    } finally {
      setLoading(false);
    }
  };

  const pick = async (url: string) => {
    setApplyingUrl(url);
    setError(null);
    try {
      await onApply(url);
      setOpen(false);
      setImages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't apply image");
    } finally {
      setApplyingUrl(null);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-[9px] px-3 py-[7px] font-condensed text-[12.5px] font-bold text-[oklch(0.35_0.02_60)]"
        style={{ boxShadow: RAISED_SM }}
      >
        <Sparkles className="size-3.5" strokeWidth={2} />
        Enhance
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-[13px] p-3.5" style={{ boxShadow: INSET_SM }}>
      <div className="flex items-center gap-2.5">
        <label className="text-[11px] font-bold tracking-[0.3px] text-[oklch(0.55_0.03_60)] uppercase">
          Variants
        </label>
        <input
          type="number"
          min={1}
          max={6}
          value={count}
          onChange={(e) => setCount(Math.min(6, Math.max(1, parseInt(e.target.value, 10) || 1)))}
          className="w-14 rounded-[9px] px-2 py-1.5 text-center text-sm font-bold text-[oklch(0.32_0.02_60)] outline-none"
          style={{ boxShadow: RAISED_SM }}
        />
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="rounded-[9px] px-3.5 py-2 font-condensed text-[12.5px] font-bold text-primary-foreground disabled:opacity-60"
          style={{ background: "var(--primary)" }}
        >
          {loading ? "Generating…" : "Generate"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setImages([]);
            setError(null);
          }}
          className="ml-auto text-[12px] font-bold text-[oklch(0.55_0.03_60)]"
        >
          Cancel
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-[oklch(0.55_0.03_60)]">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : null}

      {error ? <p className="text-[12.5px] font-semibold text-[var(--nonveg)]">{error}</p> : null}

      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => pick(url)}
              disabled={applyingUrl !== null}
              className="relative aspect-square overflow-hidden rounded-[10px] disabled:opacity-60"
              style={{ boxShadow: RAISED_SM }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Enhanced variant" className="size-full object-cover" />
              {applyingUrl === url ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Loader2 className="size-4 animate-spin text-white" />
                </div>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
