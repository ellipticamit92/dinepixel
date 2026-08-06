import { RAISED_SM, INSET } from "@/lib/neu-shadows";
import type { BuilderStep } from "@/lib/builder-state";

const STEP_DEFS: { key: BuilderStep; n: string; label: string }[] = [
  { key: "upload", n: "1", label: "Upload" },
  { key: "review", n: "2", label: "AI Review" },
  { key: "published", n: "3", label: "Publish" },
];

export function StepIndicator({ step }: { step: BuilderStep }) {
  const order: BuilderStep[] = ["upload", "review", "published"];
  const curIdx = step === "processing" ? 0 : order.indexOf(step);

  return (
    <div className="flex flex-wrap justify-center gap-3 px-6 pt-[22px] pb-1 sm:px-10">
      {STEP_DEFS.map((sd, i) => {
        const on = i === curIdx;
        const done = i < curIdx;
        return (
          <div
            key={sd.key}
            className="flex items-center gap-[9px] rounded-full bg-background px-[17px] py-[9px]"
            style={{ boxShadow: on ? INSET : RAISED_SM }}
          >
            <span
              className="flex size-[22px] items-center justify-center rounded-full text-xs font-bold"
              style={{
                background: on
                  ? "var(--primary)"
                  : done
                    ? "var(--success)"
                    : "oklch(0.88 0.01 80)",
                color: on || done ? "var(--primary-foreground)" : "oklch(0.5 0.02 60)",
              }}
            >
              {sd.n}
            </span>
            <span
              className="font-condensed text-sm font-bold tracking-[0.3px]"
              style={{ color: on ? "oklch(0.26 0.02 60)" : "oklch(0.52 0.02 60)" }}
            >
              {sd.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
