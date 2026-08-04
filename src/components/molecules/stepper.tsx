import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  currentStep,
  className,
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) {
  return (
    <ol className={cn("flex items-start", className)}>
      {steps.map((label, index) => {
        const step = index + 1;
        const active = step === currentStep;
        const complete = step < currentStep;

        return (
          <li key={label} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  active || complete
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {step}
              </span>
              {step < steps.length ? (
                <div
                  className={cn(
                    "mx-3 h-0.5 flex-1 rounded-full",
                    complete ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
            </div>
            <span
              className={cn(
                "mt-2 text-sm font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
