"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Dropzone({
  accept = ".pdf,.jpg,.jpeg,.png",
  hint = "PDF, JPEG, or PNG (Max 20MB)",
  onFileSelect,
  className,
}: {
  accept?: string;
  hint?: string;
  onFileSelect?: (file: File) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect?.(file);
    }
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-secondary/30 px-6 py-10 text-center transition-colors",
        isDragging && "border-primary bg-primary/5",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-card shadow-sm">
        <UploadCloud className="size-5 text-primary" />
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">
          {fileName ?? "Drag and drop your menu here"}
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={() => inputRef.current?.click()}
      >
        Browse Files
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}
