import { FileText } from "lucide-react";
import { RAISED_SM } from "@/lib/neu-shadows";
import type { MenuLensJob } from "@/lib/menulens";

export type ProcessingStatus = "uploading" | MenuLensJob["status"];

const STATUS_COPY: Record<ProcessingStatus, string> = {
  uploading: "Uploading your file…",
  pending: "Queued for extraction…",
  processing: "Extracting dishes, prices and Veg / Non-Veg tags…",
  done: "Wrapping up…",
  error: "Something went wrong.",
};

const PLACEHOLDER_ROWS = [0, 1, 2, 3];

export function BuilderStepProcessing({
  fileName,
  status,
}: {
  fileName: string | null;
  status: ProcessingStatus;
}) {
  return (
    <div>
      <h1 className="font-display text-[32px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[38px]">
        Reading your menu…
      </h1>
      <p className="mt-3 mb-6 text-[15px] text-muted-foreground">
        {STATUS_COPY[status]}
      </p>
      <div
        className="relative h-[300px] overflow-hidden rounded-3xl bg-background"
        style={{
          boxShadow:
            "inset 6px 6px 15px oklch(0.85 0.02 72), inset -6px -6px 15px oklch(0.99 0.008 88)",
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[oklch(0.68_0.03_74)]">
          <FileText className="size-10" strokeWidth={1.3} />
          {fileName ? (
            <span className="max-w-[80%] truncate text-[13px] font-semibold text-[oklch(0.55_0.03_60)]">
              {fileName}
            </span>
          ) : null}
        </div>
        <div className="absolute inset-0 bg-[oklch(0.62_0.17_42_/_0.06)]" />
        <div
          className="animate-pl-scan absolute right-0 left-0 h-[3px] bg-primary"
          style={{ boxShadow: "0 0 22px 6px oklch(0.62 0.17 42 / 0.6)" }}
        />
      </div>
      <div className="mt-5 flex flex-col gap-[9px]">
        {PLACEHOLDER_ROWS.map((row) => (
          <div
            key={row}
            className="animate-pl-pulse flex items-center gap-[11px] rounded-[13px] bg-background px-[15px] py-3"
            style={{ boxShadow: RAISED_SM, animationDelay: `${row * 0.18}s` }}
          >
            <span className="size-[9px] rounded-full bg-[oklch(0.88_0.01_80)]" />
            <span className="h-3.5 flex-1 rounded-full bg-[oklch(0.9_0.01_80)]" />
            <span className="h-3.5 w-14 rounded-full bg-[oklch(0.92_0.01_80)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
