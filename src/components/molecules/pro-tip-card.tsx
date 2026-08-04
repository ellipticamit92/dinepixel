import { Info } from "lucide-react";

export function ProTipCard({
  title = "Pro Tip",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border bg-card p-5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Info className="size-4" />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
