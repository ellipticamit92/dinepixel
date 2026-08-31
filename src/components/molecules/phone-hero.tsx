import { ImageIcon, MoonStar } from "lucide-react";

export function PhoneHero({
  height = 130,
  logoSize = 36,
  name = "Bloom Cafe",
  location = "Downtown District",
  rating = "4.9 (2k+)",
  logoUrl = null,
  bannerUrl = null,
  zomatoUrl = null,
  zomatoRating = null,
  swiggyUrl = null,
  swiggyRating = null,
  isOpen = true,
}: {
  height?: number;
  logoSize?: number;
  name?: string;
  location?: string;
  rating?: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  zomatoUrl?: string | null;
  zomatoRating?: number | null;
  swiggyUrl?: string | null;
  swiggyRating?: number | null;
  isOpen?: boolean;
}) {
  const hasDeliveryBadges = Boolean(zomatoUrl || swiggyUrl);
  return (
    <div className="px-[9px] pt-[9px]">
      <div
        className="relative overflow-hidden rounded-[20px] shadow-neu-raised-sm"
        style={{ height }}
      >
        {bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[oklch(0.87_0.02_74)] text-[oklch(0.68_0.03_74)]">
            <ImageIcon className="size-6" strokeWidth={1.5} />
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.14 0.02 55 / 0.8) 6%, transparent 60%)",
          }}
        />
        {logoUrl ? (
          <div
            className="absolute top-[9px] left-[9px] overflow-hidden rounded-[12px] border-2 border-white/70 shadow-md"
            style={{ height: logoSize, width: logoSize }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Cafe logo" className="size-full object-cover" />
          </div>
        ) : null}
        {hasDeliveryBadges ? (
          <div className="absolute top-[9px] right-[9px] flex flex-col items-end gap-1.5">
            {zomatoUrl ? (
              <a
                href={zomatoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-white/25 py-1 pr-2.5 pl-1 text-[10.5px] font-bold text-white backdrop-blur-[5px]"
                style={{ background: "oklch(0.52 0.2 25 / 0.85)" }}
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-white text-[8.5px] font-black text-[oklch(0.52 0.2 25)]">
                  Z
                </span>
                {zomatoRating ? <span>★ {zomatoRating}</span> : "Zomato"}
              </a>
            ) : null}
            {swiggyUrl ? (
              <a
                href={swiggyUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-white/25 py-1 pr-2.5 pl-1 text-[10.5px] font-bold text-white backdrop-blur-[5px]"
                style={{ background: "oklch(0.62 0.18 45 / 0.85)" }}
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-white text-[8.5px] font-black text-[oklch(0.62 0.18 45)]">
                  S
                </span>
                {swiggyRating ? <span>★ {swiggyRating}</span> : "Swiggy"}
              </a>
            ) : null}
          </div>
        ) : (
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
        )}
        {!isOpen && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ background: "oklch(0.1 0.01 60 / 0.55)" }}
          >
            <div
              className="flex items-center gap-2 rounded-full px-5 py-2 backdrop-blur-[6px]"
              style={{ background: "oklch(0.08 0.01 60 / 0.65)", border: "1px solid oklch(1 0 0 / 0.15)" }}
            >
              <MoonStar className="size-4 text-white" strokeWidth={2} />
              <span className="font-display text-[17px] tracking-[0.5px] text-white">Closed</span>
            </div>
          </div>
        )}
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
