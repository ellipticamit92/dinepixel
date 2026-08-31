"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, ImageIcon, Trash2 } from "lucide-react";
import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { RAISED_SM, INSET_SM } from "@/lib/neu-shadows";
import {
  removeMenuImage,
  updatePaymentSettings,
  uploadMenuImage,
} from "@/lib/menu-actions";
import type { MenuForSession } from "@/lib/menu-repo";

export function AdminPaymentPage({
  session,
  menu,
}: {
  session: { name: string };
  menu: MenuForSession | null;
}) {
  const [paymentQrUrl, setPaymentQrUrl] = useState<string | null>(menu?.paymentQrUrl ?? null);
  const [upiId, setUpiId] = useState(menu?.upiId ?? "");
  const [paypalUrl, setPaypalUrl] = useState(menu?.paypalUrl ?? "");
  const [stripeUrl, setStripeUrl] = useState(menu?.stripeUrl ?? "");
  const [uploadingQr, setUploadingQr] = useState(false);
  const [saving, setSaving] = useState(false);

  const uploadQr = async (file: File) => {
    if (!menu) {
      toast.error("Build a menu first, then add payment settings here");
      return;
    }
    setUploadingQr(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const { url } = await uploadMenuImage(menu.id, "paymentQr", fd);
      setPaymentQrUrl(url);
      toast.success("QR code uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingQr(false);
    }
  };

  const removeQr = async () => {
    if (!menu) return;
    const before = paymentQrUrl;
    setPaymentQrUrl(null);
    try {
      await removeMenuImage(menu.id, "paymentQr");
      toast.success("QR code removed");
    } catch {
      setPaymentQrUrl(before);
      toast.error("Couldn't remove QR code");
    }
  };

  const save = async () => {
    if (!menu) {
      toast.error("Build a menu first, then add payment settings here");
      return;
    }
    setSaving(true);
    try {
      await updatePaymentSettings(menu.id, {
        upiId: upiId.trim() || null,
        paypalUrl: paypalUrl.trim() || null,
        stripeUrl: stripeUrl.trim() || null,
      });
      toast.success("Payment settings saved");
    } catch {
      toast.error("Couldn't save payment settings");
    } finally {
      setSaving(false);
    }
  };

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
          Payment
        </h1>
        <p className="mt-2 text-[14.5px] text-muted-foreground">
          Upload your payment QR code and add UPI, PayPal, or Stripe links so customers can pay easily.
        </p>

        {/* QR Code */}
        <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
          <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            Payment QR code
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Upload a UPI or any QR code image — displayed to customers at checkout so they can scan and pay.
          </p>
          <div className="mt-4">
            {paymentQrUrl ? (
              <div className="flex items-start gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={paymentQrUrl}
                  alt="Payment QR"
                  className="size-[140px] rounded-[16px] object-contain"
                  style={{ boxShadow: RAISED_SM }}
                />
                <div className="flex flex-col gap-2.5 pt-1">
                  <label
                    className="cursor-pointer rounded-[11px] px-5 py-2.5 font-condensed text-[13px] font-bold text-[oklch(0.35_0.02_60)]"
                    style={{ boxShadow: RAISED_SM }}
                  >
                    {uploadingQr ? "Uploading…" : "Replace QR"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingQr}
                      onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadQr(f); }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={removeQr}
                    disabled={uploadingQr}
                    className="flex items-center gap-1.5 rounded-[11px] px-5 py-2.5 font-condensed text-[13px] font-bold text-[oklch(0.55_0.03_60)] disabled:opacity-60"
                    style={{ boxShadow: RAISED_SM }}
                  >
                    <Trash2 className="size-3.5" strokeWidth={2} />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl py-10 text-center"
                style={{ boxShadow: INSET_SM }}
              >
                <div
                  className="flex size-14 items-center justify-center rounded-[16px]"
                  style={{ boxShadow: RAISED_SM }}
                >
                  <ImageIcon className="size-6 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[oklch(0.38_0.02_60)]">
                    {uploadingQr ? "Uploading…" : "Upload QR code image"}
                  </div>
                  <div className="mt-1 text-[12px] text-muted-foreground">PNG, JPEG, WebP · max 5 MB</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingQr}
                  onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadQr(f); }}
                />
              </label>
            )}
          </div>
        </div>

        {/* UPI ID */}
        <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
          <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            UPI ID
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Your UPI VPA shown alongside the QR code for customers who prefer to type it in.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <div
              className="flex min-w-[200px] flex-1 items-center rounded-[11px] px-3.5 py-3"
              style={{ boxShadow: INSET_SM }}
            >
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full border-none bg-transparent text-sm font-semibold text-[oklch(0.32_0.02_60)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* PayPal */}
        <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
          <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            PayPal link
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Your PayPal.me link — customers tap it to pay you directly via PayPal.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <div
              className="flex min-w-[200px] flex-1 items-center rounded-[11px] px-3.5 py-3"
              style={{ boxShadow: INSET_SM }}
            >
              <input
                type="url"
                value={paypalUrl}
                onChange={(e) => setPaypalUrl(e.target.value)}
                placeholder="https://paypal.me/yourname"
                className="w-full border-none bg-transparent text-sm font-semibold text-[oklch(0.32_0.02_60)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stripe */}
        <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
          <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            Stripe payment link
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            A Stripe-hosted payment link — ideal for accepting card payments from international customers.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <div
              className="flex min-w-[200px] flex-1 items-center rounded-[11px] px-3.5 py-3"
              style={{ boxShadow: INSET_SM }}
            >
              <input
                type="url"
                value={stripeUrl}
                onChange={(e) => setStripeUrl(e.target.value)}
                placeholder="https://buy.stripe.com/…"
                className="w-full border-none bg-transparent text-sm font-semibold text-[oklch(0.32_0.02_60)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="mt-6">
          <button
            type="button"
            onClick={save}
            disabled={saving || !menu}
            className="rounded-[11px] px-7 py-3 font-condensed text-[15px] font-bold text-[oklch(0.35_0.02_60)] disabled:opacity-60"
            style={{ boxShadow: RAISED_SM }}
          >
            {saving ? "Saving…" : "Save payment settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
