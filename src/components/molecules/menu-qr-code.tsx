"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { RAISED_LG, RAISED_SM, INSET_SM } from "@/lib/neu-shadows";

export function MenuQrCode({
  slug,
  url,
  label = "Scan at the table",
  filename,
}: {
  slug: string;
  url: string;
  label?: string;
  filename?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = filename ?? `${slug}-menu-qr.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="rounded-[22px] bg-background p-[22px] text-center" style={{ boxShadow: RAISED_LG }}>
      <div
        className="flex w-[161px] items-center justify-center rounded-xl bg-white p-[11px]"
        style={{ boxShadow: INSET_SM }}
      >
        <QRCodeCanvas ref={canvasRef} value={url} size={139} fgColor="oklch(0.24 0.02 60)" level="M" />
      </div>
      <div className="mt-3.5 text-xs font-bold tracking-[0.5px] text-[oklch(0.55_0.03_60)] uppercase">
        {label}
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
  );
}
