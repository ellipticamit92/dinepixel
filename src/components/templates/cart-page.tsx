"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ImageIcon, Minus, Plus, Trash2 } from "lucide-react";
import { PhoneHero } from "@/components/molecules/phone-hero";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { useStoredTable } from "@/lib/table";
import { storePhone, useStoredPhone } from "@/lib/customer";
import { recordCustomerOrder } from "@/lib/menu-actions";
import { priceStr } from "@/lib/menu-seed";
import { RAISED_SM, INSET_SM, SUCCESS_GLOW } from "@/lib/neu-shadows";
import type { MenuTheme } from "@/lib/menu-repo";

export function CartPage({
  slug,
  menuId,
  restaurantName,
  logoUrl,
  bannerUrl,
  whatsappNumber,
  theme = "plate",
}: {
  slug: string;
  menuId: string;
  restaurantName: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  whatsappNumber?: string | null;
  theme?: MenuTheme;
}) {
  const { items, setQty, clear } = useCart(slug);
  const table = useStoredTable(slug);
  const storedPhone = useStoredPhone(slug);
  const total = cartTotal(items);
  const count = cartCount(items);

  const [phoneOverride, setPhoneOverride] = useState<string | null>(null);
  const [saveOverride, setSaveOverride] = useState<boolean | null>(null);
  const phone = phoneOverride ?? storedPhone ?? "";
  const saveNumber = saveOverride ?? !!storedPhone;

  const whatsappMessage = () => {
    const lines = items.map((i) => `${i.qty} × ${i.name} — ${priceStr(i.qty * i.price)}`);
    const tableLine = table ? `Table: ${table}\n` : "";
    return `${tableLine}Order for ${restaurantName}:\n${lines.join("\n")}\n\nTotal: ${priceStr(total)}`;
  };
  const whatsappHref = `https://wa.me/${whatsappNumber ?? ""}?text=${encodeURIComponent(whatsappMessage())}`;

  const sendOrder = () => {
    const digits = phone.replace(/[^0-9]/g, "");
    if (!saveNumber || digits.length < 8) return;
    storePhone(slug, digits);
    recordCustomerOrder(menuId, digits).catch(() => {
      // Best-effort — the order still goes out on WhatsApp even if this fails.
    });
  };

  return (
    <div
      data-menu-theme={theme}
      className="mx-auto flex min-h-dvh max-w-md flex-col bg-background pb-10 font-sans text-[oklch(0.28_0.02_60)]"
    >
      <PhoneHero height={190} logoSize={64} name={restaurantName} logoUrl={logoUrl} bannerUrl={bannerUrl} />

      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Link
          href={`/${slug}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-[10px]"
          style={{ boxShadow: RAISED_SM }}
        >
          <ChevronLeft className="size-4" strokeWidth={2.5} />
        </Link>
        <h1 className="font-display text-xl text-[oklch(0.24_0.02_60)]">Your cart</h1>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {table ? (
            <span
              className="shrink-0 rounded-full px-3 py-1 font-condensed text-xs font-bold tracking-[0.3px] text-[oklch(0.35_0.02_60)]"
              style={{ boxShadow: INSET_SM }}
            >
              Table {table}
            </span>
          ) : null}
          {items.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Remove all items from your cart?")) clear();
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-condensed text-xs font-bold tracking-[0.3px] text-[oklch(0.5_0.03_60)]"
              style={{ boxShadow: RAISED_SM }}
            >
              <Trash2 className="size-3" strokeWidth={2} style={{ color: "var(--nonveg)" }} />
              Empty cart
            </button>
          ) : null}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <div className="text-[15px] font-semibold text-muted-foreground">Your cart is empty.</div>
          <Link
            href={`/${slug}`}
            className="rounded-xl px-5 py-2.5 font-condensed text-sm font-bold text-[oklch(0.35_0.02_60)]"
            style={{ boxShadow: RAISED_SM }}
          >
            Browse the menu
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 px-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl bg-background p-3.5"
                style={{ boxShadow: RAISED_SM }}
              >
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[oklch(0.87_0.02_74)] text-[oklch(0.68_0.03_74)]">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <ImageIcon className="size-4" strokeWidth={1.5} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-condensed text-[15px] font-bold text-[oklch(0.26_0.02_60)]">
                    {item.name}
                  </div>
                  <div className="text-[13px] font-semibold text-primary">{priceStr(item.price)}</div>
                </div>
                <div
                  className="flex shrink-0 items-center gap-2.5 rounded-full px-2 py-1.5"
                  style={{ boxShadow: INSET_SM }}
                >
                  <button
                    type="button"
                    onClick={() => setQty(item.id, item.qty - 1)}
                    aria-label={item.qty === 1 ? "Remove item" : "Decrease quantity"}
                    className="flex size-5 items-center justify-center"
                  >
                    {item.qty === 1 ? (
                      <Trash2 className="size-3.5" strokeWidth={2} style={{ color: "var(--nonveg)" }} />
                    ) : (
                      <Minus className="size-3.5" strokeWidth={2} />
                    )}
                  </button>
                  <span className="w-4 text-center font-condensed text-sm font-bold">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(item.id, item.qty + 1)}
                    aria-label="Increase quantity"
                    className="flex size-5 items-center justify-center"
                  >
                    <Plus className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 px-4">
            <div
              className="flex items-center justify-between rounded-2xl bg-background p-[18px]"
              style={{ boxShadow: RAISED_SM }}
            >
              <span className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
                Total ({count} item{count > 1 ? "s" : ""})
              </span>
              <span className="font-display text-xl text-[oklch(0.24_0.02_60)]">{priceStr(total)}</span>
            </div>

            <div
              className="mt-3 flex flex-col gap-2.5 rounded-2xl bg-background p-[14px]"
              style={{ boxShadow: RAISED_SM }}
            >
              <label className="flex items-start gap-2.5 text-[13px] font-semibold text-[oklch(0.4_0.02_60)]">
                <input
                  type="checkbox"
                  checked={saveNumber}
                  onChange={(e) => setSaveOverride(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--success)]"
                />
                Save my number so we can send offers &amp; updates
              </label>
              {saveNumber ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhoneOverride(e.target.value)}
                  placeholder="Your WhatsApp number, e.g. 919876543210"
                  className="w-full rounded-[10px] px-3.5 py-3 text-sm font-semibold text-[oklch(0.32_0.02_60)] outline-none"
                  style={{ boxShadow: INSET_SM }}
                />
              ) : null}
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={sendOrder}
              className="mt-3 flex items-center justify-center gap-2.5 rounded-2xl py-4 font-condensed text-base font-bold tracking-[0.3px] text-primary-foreground"
              style={{ background: "var(--success)", boxShadow: SUCCESS_GLOW }}
            >
              Send order on WhatsApp
            </a>
          </div>
        </>
      )}
    </div>
  );
}
