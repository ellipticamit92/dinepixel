import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <UtensilsCrossed className="size-4" />
      </span>
      <span className="text-lg tracking-tight text-foreground">MenuAI</span>
    </div>
  );
}
