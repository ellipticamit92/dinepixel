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
  updateMenuSlug,
  updateMenuTheme,
  updateRestaurantName,
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
  const [restaurantName, setRestaurantName] = useState(menu?.restaurantName ?? "");
  const [savingName, setSavingName] = useState(false);
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
  const [slug, setSlug] = useState(menu?.slug ?? "");
  const [savingSlug, setSavingSlug] = useState(false);
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

  const saveRestaurantName = async () => {
    if (!menu) {
      toast.error("Build a menu first, then set its name here");
      return;
    }
    const trimmed = restaurantName.trim();
    if (!trimmed) {
      toast.error("Restaurant name can't be empty");
      return;
    }
    setSavingName(true);
    try {
      const saved = await updateRestaurantName(menu.id, trimmed);
      setRestaurantName(saved.restaurantName);
      toast.success("Restaurant name updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save restaurant name");
    } finally {
      setSavingName(false);
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

  const saveSlug = async () => {
    if (!menu) {
      toast.error("Build a menu first, then change the URL here");
      return;
    }
    const trimmed = slug.trim();
    if (!trimmed) { toast.error("URL slug can't be empty"); return; }
    setSavingSlug(true);
    try {
      const saved = await updateMenuSlug(menu.id, trimmed);
      setSlug(saved.slug);
      toast.success(`Menu URL updated — new link: dinepixel.cloud/${saved.slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update URL slug");
    } finally {
      setSavingSlug(false);
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
            Restaurant name
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Shown on your public menu, cart, and dashboard pages.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <div
              className="flex min-w-[200px] flex-1 items-center rounded-[11px] px-3.5 py-3"
              style={{ boxShadow: INSET_SM }}
            >
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. The Bistro Cafe"
                maxLength={200}
                className="w-full border-none bg-transparent text-sm font-semibold text-[oklch(0.32_0.02_60)] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={saveRestaurantName}
              disabled={savingName}
              className="shrink-0 rounded-[11px] px-5 py-2.5 font-condensed text-[13px] font-bold text-[oklch(0.35_0.02_60)] disabled:opacity-60"
              style={{ boxShadow: RAISED_SM }}
            >
              {savingName ? "Saving…" : "Save name"}
            </button>
          </div>
        </div>

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
            Menu URL slug
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Your public menu lives at <span className="font-semibold text-[oklch(0.38_0.02_60)]">dinepixel.cloud/</span>
            <span className="font-semibold text-primary">{slug || "your-slug"}</span>. Use lowercase
            letters, numbers, and hyphens only. Changing this will break any existing QR codes or
            shared links pointing to the old URL.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <div
              className="flex min-w-[200px] flex-1 items-center gap-1.5 rounded-[11px] px-3.5 py-3"
              style={{ boxShadow: INSET_SM }}
            >
              <span className="shrink-0 text-[13px] font-semibold text-[oklch(0.6_0.03_60)]">
                dinepixel.cloud/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder="your-cafe-name"
                maxLength={80}
                className="min-w-0 flex-1 border-none bg-transparent text-sm font-semibold text-[oklch(0.32_0.02_60)] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={saveSlug}
              disabled={savingSlug}
              className="shrink-0 rounded-[11px] px-5 py-2.5 font-condensed text-[13px] font-bold text-[oklch(0.35_0.02_60)] disabled:opacity-60"
              style={{ boxShadow: RAISED_SM }}
            >
              {savingSlug ? "Saving…" : "Save URL"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
