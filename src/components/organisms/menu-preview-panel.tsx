import { BadgeCheck, Languages, Zap } from "lucide-react";
import { IconPill } from "@/components/atoms/icon-pill";
import { MenuPreviewMock } from "@/components/molecules/menu-preview-mock";
import { ProTipCard } from "@/components/molecules/pro-tip-card";

export function MenuPreviewPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <MenuPreviewMock />
        <div className="mt-4 flex flex-wrap gap-2">
          <IconPill icon={BadgeCheck} label="AI Extraction" tone="success" />
          <IconPill icon={Zap} label="99% Accuracy" tone="primary" />
          <IconPill icon={Languages} label="Auto-translation" tone="neutral" />
        </div>
      </div>
      <ProTipCard>
        For the best results, ensure your menu photos are well-lit and the
        text is clearly legible. We&apos;ll automatically identify prices,
        descriptions, and dietary tags.
      </ProTipCard>
    </div>
  );
}
