import { cn } from "@/lib/utils";

/** Flat gradient placeholder standing in for a photo/screenshot asset. */
export function PlaceholderGraphic({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary via-secondary to-accent",
        className,
      )}
    >
      {children}
    </div>
  );
}
