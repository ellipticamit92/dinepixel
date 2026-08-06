import { RAISED_LG } from "@/lib/neu-shadows";

export function FeatureCard({
  title,
  body,
  tint,
  mark,
  round,
}: {
  title: string;
  body: string;
  tint: string;
  mark: string;
  round: string;
}) {
  return (
    <div className="flex gap-[18px] rounded-[22px] bg-background p-6" style={{ boxShadow: RAISED_LG }}>
      <div
        className="flex size-[46px] shrink-0 items-center justify-center rounded-[14px]"
        style={{ background: tint }}
      >
        <span className="size-4" style={{ background: mark, borderRadius: round }} />
      </div>
      <div>
        <div className="font-condensed text-[19px] font-bold text-[oklch(0.26_0.02_60)]">
          {title}
        </div>
        <div className="mt-[5px] text-sm leading-[1.5] text-[oklch(0.48_0.02_60)] text-pretty">
          {body}
        </div>
      </div>
    </div>
  );
}
