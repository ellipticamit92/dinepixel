"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { MenuQrCode } from "@/components/molecules/menu-qr-code";
import { RAISED_SM, INSET_SM } from "@/lib/neu-shadows";
import { menuUrl } from "@/lib/site";
import { updateTableCount } from "@/lib/menu-actions";
import type { MenuForSession } from "@/lib/menu-repo";

export function AdminTablesPage({
  session,
  menu,
}: {
  session: { name: string };
  menu: MenuForSession | null;
}) {
  const [tableCount, setTableCount] = useState(menu?.tableCount?.toString() ?? "");
  const [savedCount, setSavedCount] = useState(menu?.tableCount ?? null);
  const [saving, setSaving] = useState(false);

  const saveTableCount = async () => {
    if (!menu) {
      toast.error("Build a menu first, then set up table QR codes here");
      return;
    }
    setSaving(true);
    try {
      const saved = await updateTableCount(menu.id, tableCount ? Number(tableCount) : null);
      setTableCount(saved.tableCount?.toString() ?? "");
      setSavedCount(saved.tableCount);
      toast.success(saved.tableCount ? "Table QR codes ready" : "Table QR codes removed");
    } catch {
      toast.error("Couldn't save table count");
    } finally {
      setSaving(false);
    }
  };

  const fullUrl = menu ? `https://${menuUrl(menu.slug)}` : "";
  const tables = savedCount ? Array.from({ length: savedCount }, (_, i) => i + 1) : [];

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar session={session} />

      <div className="mx-auto w-full max-w-[760px] px-6 py-6 pb-16 sm:px-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-[13px] font-bold tracking-[0.3px] text-[oklch(0.5_0.02_60)] hover:text-primary"
        >
          <ChevronLeft className="size-4" strokeWidth={2.5} />
          Back to dashboard
        </Link>

        <h1 className="mt-3.5 font-display text-[28px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[34px]">
          Table QR codes
        </h1>
        <p className="mt-2 text-[14.5px] text-muted-foreground">
          Generate one QR code per table. When a guest scans it, their table number is included
          automatically when they send their order on WhatsApp.
        </p>

        <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
          <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            Number of tables
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <div
              className="flex w-[120px] items-center rounded-[11px] px-3.5 py-3"
              style={{ boxShadow: INSET_SM }}
            >
              <input
                type="number"
                min={1}
                max={200}
                value={tableCount}
                onChange={(e) => setTableCount(e.target.value)}
                placeholder="e.g. 12"
                className="w-full border-none bg-transparent text-sm font-semibold text-[oklch(0.32_0.02_60)] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={saveTableCount}
              disabled={saving}
              className="shrink-0 rounded-[11px] px-5 py-2.5 font-condensed text-[13px] font-bold text-[oklch(0.35_0.02_60)] disabled:opacity-60"
              style={{ boxShadow: RAISED_SM }}
            >
              {saving ? "Saving…" : "Generate QR codes"}
            </button>
          </div>
        </div>

        {tables.length > 0 && menu ? (
          <div className="mt-6 flex flex-wrap gap-[18px]">
            {tables.map((n) => (
              <MenuQrCode
                key={n}
                slug={menu.slug}
                url={`${fullUrl}?table=${n}`}
                label={`Table ${n}`}
                filename={`${menu.slug}-table-${n}-qr.png`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
