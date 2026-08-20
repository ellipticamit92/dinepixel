import { INSET_SM } from "@/lib/neu-shadows";

export function DeliveryLinkField({
  label,
  accent,
  url,
  rating,
  onUrlChange,
  onRatingChange,
}: {
  label: string;
  accent: string;
  url: string;
  rating: string;
  onUrlChange: (value: string) => void;
  onRatingChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        className="mb-[7px] block text-[11px] font-bold tracking-[0.6px] uppercase"
        style={{ color: accent }}
      >
        {label}
      </label>
      <div className="flex gap-2">
        <div
          className="flex flex-1 items-center gap-2 rounded-[11px] px-[13px] py-[9px]"
          style={{ boxShadow: INSET_SM }}
        >
          <input
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder={`https://www.${label.toLowerCase()}.com/...`}
            className="min-w-0 flex-1 border-none bg-transparent text-[13.5px] font-semibold text-[oklch(0.32_0.02_60)] outline-none"
          />
        </div>
        <div
          className="flex w-[86px] shrink-0 items-center gap-1.5 rounded-[11px] px-[13px] py-[9px]"
          style={{ boxShadow: INSET_SM }}
        >
          <span className="text-[13px] font-bold text-[oklch(0.6_0.15_80)]">★</span>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={rating}
            onChange={(e) => onRatingChange(e.target.value)}
            placeholder="4.5"
            className="w-full border-none bg-transparent font-condensed text-[13.5px] font-bold text-[oklch(0.24_0.02_60)] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
