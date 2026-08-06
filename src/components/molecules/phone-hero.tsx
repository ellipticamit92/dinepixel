import { ImageIcon } from "lucide-react";

export function PhoneHero({
  height = 130,
  name = "Bloom Cafe",
  location = "Downtown District",
  rating = "4.9 (2k+)",
}: {
  height?: number;
  name?: string;
  location?: string;
  rating?: string;
}) {
  return (
    <div className="px-[9px] pt-[9px]">
      <div
        className="relative overflow-hidden rounded-[20px] shadow-neu-raised-sm"
        style={{ height }}
      >
        <div className="flex h-full w-full items-center justify-center bg-[oklch(0.87_0.02_74)] text-[oklch(0.68_0.03_74)]">
          <ImageIcon className="size-6" strokeWidth={1.5} />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.14 0.02 55 / 0.8) 6%, transparent 60%)",
          }}
        />
        <div className="absolute top-[9px] right-[9px] flex gap-1.5">
          {["♡", "⤴"].map((g) => (
            <div
              key={g}
              className="flex size-[26px] items-center justify-center rounded-[9px] border border-white/25 text-[11px] text-[oklch(0.99_0.01_85)] backdrop-blur-[5px]"
              style={{ background: "oklch(0.95 0.012 84 / 0.32)" }}
            >
              {g}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute right-[13px] bottom-[10px] left-[13px]">
          <div className="font-display text-[20px] leading-none tracking-[0.3px] text-[oklch(0.99_0.01_85)]">
            {name}
          </div>
          <div className="mt-[5px] flex items-center gap-2 text-[9.5px] font-semibold text-[oklch(0.92_0.01_85)]">
            <span>◉ {location}</span>
            <span
              className="rounded-full px-[7px] py-[2px] backdrop-blur-[5px]"
              style={{ background: "oklch(0.95 0.012 84 / 0.28)" }}
            >
              ★ {rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
