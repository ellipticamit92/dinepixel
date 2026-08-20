"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { RAISED_SM } from "@/lib/neu-shadows";

const DISMISS_KEY = "install-hint-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * iOS Safari has no install-prompt API — "Add to Home Screen" only exists as a
 * manual step under the Share sheet, so that's the platform where an
 * in-page nudge actually matters. Android/Chrome gets a real one-tap prompt
 * via `beforeinstallprompt` when the browser judges the page installable.
 */
export function InstallHint() {
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    if (isIos) {
      // window/navigator don't exist during SSR, so this can only run post-mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlatform("ios");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPlatform("android");
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setPlatform(null);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    dismiss();
  };

  if (!platform) return null;

  return (
    <div
      className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-background p-3.5"
      style={{ boxShadow: RAISED_SM }}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-[10px] text-primary"
        style={{ boxShadow: RAISED_SM }}
      >
        {platform === "ios" ? (
          <Share className="size-4" strokeWidth={2} />
        ) : (
          <Download className="size-4" strokeWidth={2} />
        )}
      </span>
      <div className="min-w-0 flex-1 text-[12.5px] leading-[1.4] text-[oklch(0.4_0.02_60)]">
        {platform === "ios" ? (
          <>
            Tap <strong>Share</strong> then <strong>Add to Home Screen</strong> to install this menu.
          </>
        ) : (
          <>Add this menu to your home screen for quick access.</>
        )}
      </div>
      {platform === "android" ? (
        <button
          type="button"
          onClick={install}
          className="shrink-0 rounded-[9px] bg-primary px-3 py-2 font-condensed text-[12px] font-bold text-primary-foreground"
        >
          Add
        </button>
      ) : null}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-[oklch(0.6_0.03_60)]"
      >
        <X className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}
