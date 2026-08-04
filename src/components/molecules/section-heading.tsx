import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}
