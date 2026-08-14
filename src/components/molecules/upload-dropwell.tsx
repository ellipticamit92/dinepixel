"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { INSET_LG } from "@/lib/neu-shadows";
import { cn } from "@/lib/utils";

export function UploadDropwell({
  fileName,
  onFileSelected,
}: {
  fileName: string | null;
  onFileSelected: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelected(file);
      }}
      className={cn(
        "relative mt-[26px] flex h-[280px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl bg-background text-center transition-opacity",
        dragging && "opacity-80"
      )}
      style={{ boxShadow: INSET_LG }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
      <UploadCloud className="size-8 text-muted-foreground" strokeWidth={1.5} />
      <div className="text-[15px] font-semibold text-muted-foreground">
        {fileName ?? "Drop your menu photo or PDF here"}
      </div>
    </div>
  );
}
