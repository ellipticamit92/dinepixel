"use client";

import { PhoneMenuPreview } from "@/components/organisms/phone-menu-preview";
import type { MenuTheme } from "@/lib/menu-repo";
import type { Dish } from "@/lib/menu-seed";

interface LivePreviewPhoneProps {
  items: Dish[];
  empty: boolean;
  cafeName?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  theme?: MenuTheme;
  menuId?: string;
}

export function LivePreviewPhone({
  items,
  empty,
  cafeName,
  logoUrl,
  bannerUrl,
  theme = "plate",
  menuId,
}: LivePreviewPhoneProps) {
  return (
    <div className="sticky top-[92px]">
      <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.8px] text-[oklch(0.56_0.03_60)] uppercase">
        <span className="animate-pl-pulse size-[7px] rounded-full bg-primary" />
        Live preview
      </div>
      <div className="mx-auto w-full max-w-[340px]">
        <PhoneMenuPreview
          dishes={items}
          slug={menuId ?? "preview"}
          restaurantName={cafeName ?? undefined}
          logoUrl={logoUrl}
          bannerUrl={bannerUrl}
          theme={theme}
          empty={empty}
        />
      </div>
    </div>
  );
}
