"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Check, Copy } from "lucide-react";
import { RAISED_LG, RAISED, RAISED_SM, INSET, INSET_SM, SUCCESS_GLOW } from "@/lib/neu-shadows";
import { menuUrl } from "@/lib/site";

export function BuilderStepPublished({
  slug,
  onBackToReview,
}: {
  slug: string;
  onBackToReview: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const link = menuUrl(slug);
  const fullUrl = `https://${link}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable; ignore
    }
  };

  const downloadQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `${slug}-menu-qr.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

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

      <div className="mt-[26px] flex flex-wrap gap-[22px]">
        <div className="rounded-[22px] bg-background p-[22px] text-center" style={{ boxShadow: RAISED_LG }}>
          <div
            className="flex w-[161px] items-center justify-center rounded-xl bg-white p-[11px]"
            style={{ boxShadow: INSET_SM }}
          >
            <QRCodeCanvas ref={canvasRef} value={fullUrl} size={139} fgColor="oklch(0.24 0.02 60)" level="M" />
          </div>
          <div className="mt-3.5 text-xs font-bold tracking-[0.5px] text-[oklch(0.55_0.03_60)] uppercase">
            Scan at the table
          </div>
          <button
            type="button"
            onClick={downloadQr}
            className="mt-[11px] block w-full rounded-xl py-[11px] font-condensed text-sm font-bold text-[oklch(0.35_0.02_60)]"
            style={{ boxShadow: RAISED_SM }}
          >
            Download QR
          </button>
        </div>

        <div className="flex min-w-[240px] flex-1 flex-col gap-3.5">
          <div className="rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED }}>
            <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
              Shareable link
            </div>
            <div className="mt-2.5 flex items-center gap-2.5">
              <div
                className="flex-1 overflow-hidden rounded-[11px] px-3.5 py-3 text-sm font-semibold text-ellipsis whitespace-nowrap text-[oklch(0.32_0.02_60)]"
                style={{ boxShadow: INSET_SM }}
              >
                {link}
              </div>
              <button
                type="button"
                onClick={copyLink}
                className="flex items-center gap-1.5 rounded-[11px] px-[17px] py-3 font-condensed text-sm font-bold text-primary-foreground"
                style={{ background: "oklch(0.28 0.02 60)" }}
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Check out our menu: ${fullUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-2xl py-4 font-condensed text-base font-bold tracking-[0.3px] text-primary-foreground"
            style={{ background: "var(--success)", boxShadow: SUCCESS_GLOW }}
          >
            <span className="size-[9px] rounded-full bg-primary-foreground" />
            Share on WhatsApp
          </a>
          <button
            type="button"
            onClick={onBackToReview}
            className="rounded-2xl py-[15px] font-condensed text-[15px] font-bold text-[oklch(0.46_0.02_60)]"
            style={{ boxShadow: RAISED_SM }}
          >
            Edit menu items
          </button>
        </div>
      </div>
    </div>
  );
}
