import { RAISED_LG, INSET } from "@/lib/neu-shadows";

export function HowItWorksCard({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[22px] bg-background p-7" style={{ boxShadow: RAISED_LG }}>
      <div
        className="flex size-[52px] items-center justify-center rounded-[15px] font-display text-[24px] text-primary"
        style={{ boxShadow: INSET }}
      >
        {n}
      </div>
      <div className="mt-[18px] font-condensed text-xl font-bold text-[oklch(0.26_0.02_60)]">
        {title}
      </div>
      <div className="mt-[7px] text-[14.5px] leading-[1.5] text-[oklch(0.48_0.02_60)] text-pretty">
        {body}
      </div>
    </div>
  );
}
