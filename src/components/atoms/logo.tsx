import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  tagline = "Upload once · serve everywhere",
}: {
  className?: string;
  tagline?: string | null;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-[11px]", className)}>
      <div
        className="flex size-[42px] shrink-0 -rotate-4 items-center justify-center rounded-[13px] bg-background text-[21px] text-primary shadow-neu-raised-sm font-display"
        aria-hidden
      >
        P
      </div>
      <div className="leading-none">
        <div className="font-display text-[22px] leading-[0.9] tracking-[0.4px] text-foreground">
          Plate
        </div>
        {tagline ? (
          <div className="mt-0.5 text-[10.5px] font-semibold tracking-[1.4px] text-muted-foreground uppercase">
            {tagline}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
