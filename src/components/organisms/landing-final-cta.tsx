import Link from "next/link";
import { INSET_LG, ACCENT_GLOW } from "@/lib/neu-shadows";

export function LandingFinalCta() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-[50px] pb-16 sm:px-10">
      <div
        className="rounded-[28px] bg-background p-8 text-center sm:p-12"
        style={{ boxShadow: INSET_LG }}
      >
        <h2 className="font-display text-[32px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[42px]">
          Ready to ditch the paper?
        </h2>
        <p className="mt-3.5 text-base text-[oklch(0.48_0.02_60)]">
          Upload your menu and see it come alive — free, in under a minute.
        </p>
        <Link
          href="/builder"
          className="mt-[26px] inline-block rounded-2xl bg-primary px-[34px] py-4 font-condensed text-[18px] font-bold tracking-[0.4px] text-primary-foreground"
          style={{ boxShadow: ACCENT_GLOW }}
        >
          Build my menu now
        </Link>
      </div>
    </section>
  );
}
