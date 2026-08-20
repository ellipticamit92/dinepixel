"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { LogoUpload } from "@/components/molecules/logo-upload";
import { BannerUpload } from "@/components/molecules/banner-upload";
import { DeliveryLinkField } from "@/components/molecules/delivery-link-field";
import { RAISED_SM } from "@/lib/neu-shadows";
import {
  removeMenuImage,
  updateDeliveryLinks,
  uploadMenuImage,
} from "@/lib/menu-actions";
import type { MenuForSession } from "@/lib/menu-repo";

export function AdminSettingsPage({
  session,
  menu,
}: {
  session: { name: string };
  menu: MenuForSession | null;
}) {
  const [logoUrl, setLogoUrl] = useState<string | null>(menu?.logoUrl ?? null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(menu?.bannerUrl ?? null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [zomatoUrl, setZomatoUrl] = useState(menu?.zomatoUrl ?? "");
  const [zomatoRating, setZomatoRating] = useState(menu?.zomatoRating?.toString() ?? "");
  const [swiggyUrl, setSwiggyUrl] = useState(menu?.swiggyUrl ?? "");
  const [swiggyRating, setSwiggyRating] = useState(menu?.swiggyRating?.toString() ?? "");
  const [savingLinks, setSavingLinks] = useState(false);

  const selectImage = async (kind: "logo" | "banner", file: File) => {
    if (!menu) {
      toast.error("Build a menu first, then add branding here");
      return;
    }
    const setUploading = kind === "logo" ? setUploadingLogo : setUploadingBanner;
    const setUrl = kind === "logo" ? setLogoUrl : setBannerUrl;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const { url } = await uploadMenuImage(menu.id, kind, formData);
      setUrl(url);
      toast.success(kind === "logo" ? "Logo updated" : "Banner updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Couldn't upload ${kind}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (kind: "logo" | "banner") => {
    if (!menu) return;
    const setUrl = kind === "logo" ? setLogoUrl : setBannerUrl;
    const before = kind === "logo" ? logoUrl : bannerUrl;
    setUrl(null);
    try {
      await removeMenuImage(menu.id, kind);
      toast.success(kind === "logo" ? "Logo removed" : "Banner removed");
    } catch {
      setUrl(before);
      toast.error(`Couldn't remove ${kind}`);
    }
  };

  const saveDeliveryLinks = async () => {
    if (!menu) {
      toast.error("Build a menu first, then add delivery links here");
      return;
    }
    setSavingLinks(true);
    try {
      const saved = await updateDeliveryLinks({
        menuId: menu.id,
        zomatoUrl,
        zomatoRating: zomatoRating ? Number(zomatoRating) : null,
        swiggyUrl,
        swiggyRating: swiggyRating ? Number(swiggyRating) : null,
      });
      setZomatoUrl(saved.zomatoUrl ?? "");
      setZomatoRating(saved.zomatoRating?.toString() ?? "");
      setSwiggyUrl(saved.swiggyUrl ?? "");
      setSwiggyRating(saved.swiggyRating?.toString() ?? "");
      toast.success("Delivery links updated");
    } catch {
      toast.error("Couldn't save delivery links");
    } finally {
      setSavingLinks(false);
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
          Settings
        </h1>
        <p className="mt-2 text-[14.5px] text-muted-foreground">
          Manage your cafe branding and delivery platform links.
        </p>

        <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
          <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            Cafe branding
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <LogoUpload
              value={logoUrl}
              onSelect={(file) => selectImage("logo", file)}
              onRemove={() => removeImage("logo")}
              uploading={uploadingLogo}
            />
            <div className="h-px" style={{ background: "oklch(0.88 0.015 72)" }} />
            <BannerUpload
              value={bannerUrl}
              onSelect={(file) => selectImage("banner", file)}
              onRemove={() => removeImage("banner")}
              uploading={uploadingBanner}
            />
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
          <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            Order online links
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Add your Zomato and Swiggy listings — shown on your public menu page with the rating.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <DeliveryLinkField
              label="Zomato"
              accent="oklch(0.52 0.2 25)"
              url={zomatoUrl}
              rating={zomatoRating}
              onUrlChange={setZomatoUrl}
              onRatingChange={setZomatoRating}
            />
            <DeliveryLinkField
              label="Swiggy"
              accent="oklch(0.62 0.18 45)"
              url={swiggyUrl}
              rating={swiggyRating}
              onUrlChange={setSwiggyUrl}
              onRatingChange={setSwiggyRating}
            />
            <button
              type="button"
              onClick={saveDeliveryLinks}
              disabled={savingLinks}
              className="self-start rounded-[11px] px-5 py-2.5 font-condensed text-[13px] font-bold text-[oklch(0.35_0.02_60)] disabled:opacity-60"
              style={{ boxShadow: RAISED_SM }}
            >
              {savingLinks ? "Saving…" : "Save links"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
