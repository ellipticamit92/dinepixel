"use client";

import { useRef } from "react";
import { ImageIcon, UploadCloud, X } from "lucide-react";
import { INSET_LG, RAISED_SM } from "@/lib/neu-shadows";

export function LogoUpload({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className="relative flex size-[84px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[20px] bg-background text-center"
        style={{ boxShadow: value ? RAISED_SM : INSET_LG }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Cafe logo" className="size-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-2 text-muted-foreground">
            <UploadCloud className="size-5" strokeWidth={1.5} />
            <span className="text-[10px] font-bold tracking-[0.3px] uppercase">Upload</span>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold text-[oklch(0.32_0.02_60)]">
          {value ? "Logo uploaded" : "No logo yet"}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          Square image, shown on your menu &amp; QR page.
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-[9px] px-3 py-[7px] font-condensed text-[12.5px] font-bold text-[oklch(0.35_0.02_60)]"
            style={{ boxShadow: RAISED_SM }}
          >
            <ImageIcon className="size-3.5" strokeWidth={2} />
            {value ? "Replace" : "Choose image"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1.5 rounded-[9px] px-3 py-[7px] font-condensed text-[12.5px] font-bold"
              style={{ boxShadow: RAISED_SM, color: "var(--nonveg)" }}
            >
              <X className="size-3.5" strokeWidth={2} />
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
