import { Separator } from "@/components/ui/separator";

export function OrDivider({ label = "OR" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Separator className="flex-1" />
    </div>
  );
}
