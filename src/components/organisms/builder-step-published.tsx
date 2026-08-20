"use client";

import { INSET, RAISED_SM } from "@/lib/neu-shadows";
import { MenuSharePanel } from "@/components/organisms/menu-share-panel";

export function BuilderStepPublished({
  slug,
  onBackToReview,
}: {
  slug: string;
  onBackToReview: () => void;
}) {
  return (
    <div>
      <div
        className="inline-flex items-center gap-[9px] rounded-full bg-background px-4 py-[9px] text-[13px] font-bold tracking-[0.4px]"
        style={{ color: "oklch(0.42 0.12 150)", boxShadow: INSET }}
      >
        <span className="size-[9px] rounded-full" style={{ background: "var(--success)" }} />
        Live &amp; published
      </div>
      <h1 className="mt-3.5 font-display text-[32px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[38px]">
        Your menu is live.
      </h1>
      <p className="mt-2.5 max-w-[460px] text-[15px] text-muted-foreground">
        Print the QR for your tables and share the link on WhatsApp. Edits
        update instantly — no reprinting.
      </p>

      <div className="mt-[26px]">
        <MenuSharePanel slug={slug}>
          <button
            type="button"
            onClick={onBackToReview}
            className="rounded-2xl py-[15px] font-condensed text-[15px] font-bold text-[oklch(0.46_0.02_60)]"
            style={{ boxShadow: RAISED_SM }}
          >
            Edit menu items
          </button>
        </MenuSharePanel>
      </div>
    </div>
  );
}
