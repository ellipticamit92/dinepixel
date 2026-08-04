import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm",
        className,
      )}
    >
      <Sparkles className="size-3.5 text-primary" />
      {children}
    </span>
  );
}
