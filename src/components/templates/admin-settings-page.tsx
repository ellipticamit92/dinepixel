"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { LogoUpload } from "@/components/molecules/logo-upload";
import { BannerUpload } from "@/components/molecules/banner-upload";
import { DeliveryLinkField } from "@/components/molecules/delivery-link-field";
import { RAISED_SM, INSET, INSET_SM } from "@/lib/neu-shadows";
import {
  removeMenuImage,
  updateDeliveryLinks,
  updateImageEnhancerUrl,
  updateMenuTheme,
  updateWhatsappNumber,
  uploadMenuImage,
} from "@/lib/menu-actions";
import type { MenuForSession, MenuTheme } from "@/lib/menu-repo";

const THEME_OPTIONS: { id: MenuTheme; label: string; blurb: string }[] = [
  { id: "plate", label: "Plate", blurb: "Warm & neumorphic" },
  { id: "bistro", label: "Bistro", blurb: "Elegant plum & serif" },
  { id: "fresh", label: "Fresh", blurb: "Clean sage-green" },
];

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
  const [whatsappNumber, setWhatsappNumber] = useState(menu?.whatsappNumber ?? "");
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const [imageEnhancerUrl, setImageEnhancerUrl] = useState(menu?.imageEnhancerUrl ?? "");
  const [savingEnhancer, setSavingEnhancer] = useState(false);
  const [theme, setTheme] = useState<MenuTheme>(menu?.theme ?? "plate");
  const [savingTheme, setSavingTheme] = useState(false);

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

  const saveWhatsappNumber = async () => {
    if (!menu) {
      toast.error("Build a menu first, then add an order number here");
      return;
    }
    setSavingWhatsapp(true);
    try {
      const saved = await updateWhatsappNumber(menu.id, whatsappNumber);
      setWhatsappNumber(saved.whatsappNumber ?? "");
      toast.success(saved.whatsappNumber ? "Order number updated" : "Order number removed");
    } catch {
      toast.error("Couldn't save order number");
    } finally {
      setSavingWhatsapp(false);
    }
  };

  const saveImageEnhancerUrl = async () => {
    if (!menu) {
      toast.error("Build a menu first, then add an enhancer endpoint here");
      return;
    }
    setSavingEnhancer(true);
    try {
      const saved = await updateImageEnhancerUrl(menu.id, imageEnhancerUrl);
      setImageEnhancerUrl(saved.imageEnhancerUrl ?? "");
      toast.success(saved.imageEnhancerUrl ? "Enhancer endpoint updated" : "Enhancer endpoint removed");
    } catch {
      toast.error("Couldn't save enhancer endpoint");
    } finally {
      setSavingEnhancer(false);
    }
  };

  const saveTheme = async (next: MenuTheme) => {
    if (!menu) {
      toast.error("Build a menu first, then pick a theme here");
      return;
    }
    const before = theme;
    setTheme(next);
    setSavingTheme(true);
    try {
      const saved = await updateMenuTheme(menu.id, next);
      setTheme(saved.theme);
      toast.success("Menu theme updated");
    } catch {
      setTheme(before);
      toast.error("Couldn't update menu theme");
    } finally {
      setSavingTheme(false);
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
          Manage your cafe branding, delivery platform links, and order number.
        </p>

        <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
          <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            Menu theme
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Pick the look for your public menu and cart pages — choose whichever suits your logo
            and branding best.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                data-menu-theme={opt.id}
                onClick={() => saveTheme(opt.id)}
                disabled={savingTheme}
                className="flex flex-col gap-3 rounded-2xl p-4 text-left disabled:opacity-60"
                style={{ background: "var(--background)", boxShadow: theme === opt.id ? INSET : RAISED_SM }}
              >
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full" style={{ background: "var(--primary)", boxShadow: RAISED_SM }} />
                  <span className="size-6 rounded-full" style={{ background: "var(--veg)" }} />
                  <span className="size-6 rounded-full" style={{ background: "var(--nonveg)" }} />
                </div>
                <div>
                  <div className="font-display text-base text-[oklch(0.26_0.02_60)]">{opt.label}</div>
                  <div className="text-[12px] font-semibold text-muted-foreground">{opt.blurb}</div>
                </div>
                {theme === opt.id ? (
                  <span
                    className="self-start rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.4px] text-primary-foreground uppercase"
                    style={{ background: "var(--primary)" }}
                  >
                    Selected
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

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

        <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
          <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            Order number (WhatsApp)
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            When a guest checks out their cart on your public menu, their order is sent to this
            number on WhatsApp. Include the country code, no spaces or symbols.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <div
              className="flex min-w-[200px] flex-1 items-center rounded-[11px] px-3.5 py-3"
              style={{ boxShadow: INSET_SM }}
            >
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 919876543210"
                className="w-full border-none bg-transparent text-sm font-semibold text-[oklch(0.32_0.02_60)] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={saveWhatsappNumber}
              disabled={savingWhatsapp}
              className="shrink-0 rounded-[11px] px-5 py-2.5 font-condensed text-[13px] font-bold text-[oklch(0.35_0.02_60)] disabled:opacity-60"
              style={{ boxShadow: RAISED_SM }}
            >
              {savingWhatsapp ? "Saving…" : "Save number"}
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
          <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            Image enhancer API
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Plug in your own image-enhancer API endpoint. It should accept a POST with the dish
            photo and a variant count, and return a list of generated image URLs. Once set, an
            &ldquo;Enhance&rdquo; option appears when editing a dish photo, letting you pick one
            of the generated variants — in different angles and a more aesthetic look — as the
            dish&apos;s photo.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <div
              className="flex min-w-[240px] flex-1 items-center rounded-[11px] px-3.5 py-3"
              style={{ boxShadow: INSET_SM }}
            >
              <input
                type="url"
                value={imageEnhancerUrl}
                onChange={(e) => setImageEnhancerUrl(e.target.value)}
                placeholder="https://api.example.com/enhance"
                className="w-full border-none bg-transparent text-sm font-semibold text-[oklch(0.32_0.02_60)] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={saveImageEnhancerUrl}
              disabled={savingEnhancer}
              className="shrink-0 rounded-[11px] px-5 py-2.5 font-condensed text-[13px] font-bold text-[oklch(0.35_0.02_60)] disabled:opacity-60"
              style={{ boxShadow: RAISED_SM }}
            >
              {savingEnhancer ? "Saving…" : "Save endpoint"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
