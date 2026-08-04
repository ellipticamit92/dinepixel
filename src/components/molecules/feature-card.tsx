import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  variant = "default",
  media,
  ctaLabel,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "default" | "accent";
  media?: React.ReactNode;
  ctaLabel?: string;
  className?: string;
}) {
  const accent = variant === "accent";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-6",
        accent
          ? "border-transparent bg-primary text-primary-foreground"
          : "bg-card text-card-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          accent ? "bg-white/15" : "bg-secondary",
        )}
      >
        <Icon className={cn("size-4.5", accent ? "text-white" : "text-foreground")} />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-semibold">{title}</h3>
        <p className={cn("text-sm", accent ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {description}
        </p>
      </div>
      {ctaLabel ? (
        <Button
          size="sm"
          variant="secondary"
          className="mt-auto w-fit bg-white text-primary hover:bg-white/90"
        >
          {ctaLabel}
        </Button>
      ) : null}
      {media ? <div className="mt-auto pt-2">{media}</div> : null}
    </div>
  );
}
