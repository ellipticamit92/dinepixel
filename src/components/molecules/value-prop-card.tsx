import { RAISED } from "@/lib/neu-shadows";

export function ValuePropCard({
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
    <div className="flex-1 rounded-[18px] bg-background p-[18px]" style={{ boxShadow: RAISED }}>
      <div
        className="flex size-[34px] items-center justify-center rounded-[10px]"
        style={{ background: tint }}
      >
        <span className="size-3" style={{ background: mark, borderRadius: round }} />
      </div>
      <div className="mt-3 font-condensed text-[15px] font-bold text-[oklch(0.26_0.02_60)]">
        {title}
      </div>
      <div className="mt-[3px] text-[13px] leading-[1.4] text-[oklch(0.5_0.02_60)]">
        {body}
      </div>
    </div>
  );
}
