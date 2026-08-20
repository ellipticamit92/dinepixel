"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { INSET_LG, RAISED_SM } from "@/lib/neu-shadows";

export function DishImageUpload({
  value,
  onSelect,
  onRemove,
  uploading = false,
}: {
  value: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  uploading?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const display = preview ?? value;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onSelect(file);
  };

  return (
    <div className="flex items-center gap-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className="relative flex size-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[13px] bg-background text-center"
        style={{ boxShadow: display ? RAISED_SM : INSET_LG }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {display ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={display} alt="Dish photo" className="size-full object-cover" />
        ) : (
          <UploadCloud className="size-4 text-muted-foreground" strokeWidth={1.5} />
        )}
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Loader2 className="size-4 animate-spin text-white" />
          </div>
        ) : null}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-[9px] px-3 py-[7px] font-condensed text-[12.5px] font-bold text-[oklch(0.35_0.02_60)]"
          style={{ boxShadow: RAISED_SM }}
        >
          <ImageIcon className="size-3.5" strokeWidth={2} />
          {display ? "Replace photo" : "Add photo"}
        </button>
        {display ? (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onRemove();
            }}
            className="flex items-center gap-1.5 rounded-[9px] px-3 py-[7px] font-condensed text-[12.5px] font-bold"
            style={{ boxShadow: RAISED_SM, color: "var(--nonveg)" }}
          >
            <X className="size-3.5" strokeWidth={2} />
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}
