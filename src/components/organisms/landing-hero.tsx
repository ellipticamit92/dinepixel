import Link from "next/link";
import { StatItem } from "@/components/molecules/stat-item";
import { LandingPhoneMenu } from "@/components/organisms/landing-phone-menu";
import { ACCENT_GLOW, INSET } from "@/lib/neu-shadows";

const stats = [
  { num: "2,400+", label: "Menus live" },
  { num: "20s", label: "Avg. build time" },
  { num: "0", label: "Reprints needed" },
];

export function LandingHero() {
  return (
    <section className="mx-auto grid max-w-[1120px] items-center gap-10 px-6 py-10 pt-10 sm:px-10 lg:grid-cols-[1fr_360px]">
      <div>
        <div
          className="inline-flex items-center gap-[9px] rounded-full px-4 py-[9px] text-[12.5px] font-bold tracking-[0.4px] text-accent-foreground"
          style={{ boxShadow: INSET }}
        >
          <span className="size-2 rounded-full bg-primary" />
          AI-powered · no typing required
        </div>
        <h1 className="mt-5 font-display text-[44px] leading-[0.98] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[60px]">
          Your paper menu,
          <br />
          online in <span className="text-primary">20 seconds.</span>
        </h1>
        <p className="mt-5 max-w-[500px] text-[18px] leading-[1.55] text-muted-foreground text-pretty">
          Snap a photo or drop a PDF. Dinepixel&apos;s AI reads every dish and
          price, auto-sorts{" "}
          <strong className="text-[var(--veg)]">Veg</strong> &amp;{" "}
          <strong className="text-[var(--nonveg)]">Non-Veg</strong>, and
          hands you a live menu page with a QR code and shareable link.
        </p>
        <div className="mt-[30px] flex items-center gap-4">
          <Link
            href="/builder"
            className="flex items-center gap-2.5 rounded-2xl bg-primary px-7 py-4 font-condensed text-[18px] font-bold tracking-[0.4px] text-primary-foreground"
            style={{ boxShadow: ACCENT_GLOW }}
          >
            <span className="inline-block size-3 rotate-45 bg-primary-foreground" />
            Build my menu
          </Link>
          <div className="text-[13.5px] leading-[1.4] font-semibold text-[oklch(0.5_0.03_60)]">
            Free to start
            <br />
            No card needed
          </div>
        </div>
        <div className="mt-[38px] flex gap-6">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>

      <LandingPhoneMenu />
    </section>
  );
}
