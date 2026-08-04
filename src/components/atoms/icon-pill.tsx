import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneStyles = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  primary: "bg-primary/10 text-primary",
  neutral: "bg-secondary text-secondary-foreground",
} as const;

export function IconPill({
  icon: Icon,
  label,
  tone = "neutral",
  className,
}: {
  icon: LucideIcon;
  label: string;
  tone?: keyof typeof toneStyles;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm",
        toneStyles[tone],
        className,
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
