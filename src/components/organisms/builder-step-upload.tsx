"use client";

import { UploadDropwell } from "@/components/molecules/upload-dropwell";
import { ValuePropCard } from "@/components/molecules/value-prop-card";
import { ACCENT_GLOW } from "@/lib/neu-shadows";

const valueProps = [
  { title: "Reads any format", body: "Photos, PDFs or screenshots — AI handles it.", tint: "oklch(0.62 0.17 42 / 0.14)", mark: "oklch(0.62 0.17 42)", round: "3px" },
  { title: "Auto Veg / Non-Veg", body: "Every dish tagged and sorted for you.", tint: "oklch(0.62 0.14 150 / 0.16)", mark: "oklch(0.5 0.14 150)", round: "50%" },
  { title: "QR + link, instantly", body: "Print it, or share on WhatsApp in one tap.", tint: "oklch(0.28 0.02 60 / 0.1)", mark: "oklch(0.28 0.02 60)", round: "3px" },
];

interface BuilderStepUploadProps {
  fileName: string | null;
  onFileSelected: (name: string) => void;
  onGenerate: () => void;
}

export function BuilderStepUpload({
  fileName,
  onFileSelected,
  onGenerate,
}: BuilderStepUploadProps) {
  return (
    <div>
      <h1 className="font-display text-[34px] leading-[1.02] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[42px]">
        Turn your paper menu
        <br />
        into a live digital one.
      </h1>
      <p className="mt-4 max-w-[520px] text-base leading-[1.5] text-muted-foreground text-pretty">
        Snap a photo of your existing menu or drop a PDF. Our AI reads every
        dish, price and detail, then sorts it into{" "}
        <strong className="text-[var(--veg)]">Veg</strong> and{" "}
        <strong className="text-[var(--nonveg)]">Non-Veg</strong> — no typing
        required.
      </p>

      <UploadDropwell fileName={fileName} onFileSelected={onFileSelected} />

      <div className="mt-[22px] flex items-center gap-3.5">
        <button
          type="button"
          onClick={onGenerate}
          className="flex items-center gap-2.5 rounded-2xl bg-primary px-[26px] py-[15px] font-condensed text-[17px] font-bold tracking-[0.4px] text-primary-foreground"
          style={{ boxShadow: ACCENT_GLOW }}
        >
          <span className="inline-block size-3 rotate-45 bg-primary-foreground" />
          Generate my menu with AI
        </button>
        <span className="text-[13px] font-semibold text-[oklch(0.55_0.03_60)]">
          Takes about 20 seconds
        </span>
      </div>

      <div className="mt-[34px] flex flex-col gap-4 sm:flex-row">
        {valueProps.map((v) => (
          <ValuePropCard key={v.title} {...v} />
        ))}
      </div>
    </div>
  );
}
