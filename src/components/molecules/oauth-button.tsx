import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OAuthButton({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn("w-full justify-center gap-2 rounded-xl font-normal", className)}
    >
      <Icon className="size-4" />
      {label}
    </Button>
  );
}
