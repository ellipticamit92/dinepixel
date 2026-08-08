"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell, MessageCircle, Send } from "lucide-react";
import { RAISED_SM, INSET_SM, ACCENT_GLOW_SM } from "@/lib/neu-shadows";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function ChannelToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-[11px] px-3.5 py-[9px] font-condensed text-[13px] font-bold tracking-[0.2px]"
      style={{
        background: "var(--background)",
        color: active ? "oklch(0.42 0.12 150)" : "oklch(0.55 0.03 60)",
        boxShadow: active ? INSET_SM : RAISED_SM,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export function AdminOfferNotifier({ logoUrl }: { logoUrl: string | null }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sendPush, setSendPush] = useState(true);
  const [sendWhatsapp, setSendWhatsapp] = useState(true);

  const sendOffer = async () => {
    const offerTitle = title.trim();
    const offerMessage = message.trim();

    if (!offerTitle) {
      toast.error("Add an offer title first");
      return;
    }
    if (!sendPush && !sendWhatsapp) {
      toast.error("Pick at least one channel to send to");
      return;
    }

    const sentVia: string[] = [];

    if (sendPush) {
      if (typeof window === "undefined" || !("Notification" in window)) {
        toast.error("Push notifications aren't supported in this browser");
      } else {
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }
        if (permission === "granted") {
          new Notification(offerTitle, {
            body: offerMessage || undefined,
            icon: logoUrl ?? undefined,
          });
          sentVia.push("push");
        } else {
          toast.error("Notification permission was denied");
        }
      }
    }

    if (sendWhatsapp) {
      const text = offerMessage ? `${offerTitle}\n${offerMessage}` : offerTitle;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      sentVia.push("WhatsApp");
    }

    if (sentVia.length) {
      toast.success(`Offer sent via ${sentVia.join(" & ")}`);
      setTitle("");
      setMessage("");
    }
  };

  return (
    <Accordion multiple defaultValue={["offer"]} className="mt-6">
      <AccordionItem
        value="offer"
        className="rounded-2xl bg-background px-[18px]"
        style={{ boxShadow: RAISED_SM }}
      >
        <AccordionTrigger className="py-3.5 text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase no-underline hover:no-underline">
          Send an offer
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-[13px] text-muted-foreground">
            Push notifies this device directly; WhatsApp opens a prefilled message you can send to
            your broadcast list.
          </p>

          <div className="mt-3.5 flex flex-col gap-2.5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Offer title (e.g. 20% off Momos today!)"
              className="rounded-[10px] px-3.5 py-[9px] text-sm font-semibold text-[oklch(0.28_0.02_60)] outline-none"
              style={{ boxShadow: INSET_SM }}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add more details (optional)"
              rows={2}
              className="resize-none rounded-[10px] px-3.5 py-[9px] text-sm font-semibold text-[oklch(0.28_0.02_60)] outline-none"
              style={{ boxShadow: INSET_SM }}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2.5 pb-1">
            <ChannelToggle
              active={sendPush}
              onClick={() => setSendPush((v) => !v)}
              icon={<Bell className="size-3.5" strokeWidth={2} />}
              label="Push (PWA)"
            />
            <ChannelToggle
              active={sendWhatsapp}
              onClick={() => setSendWhatsapp((v) => !v)}
              icon={<MessageCircle className="size-3.5" strokeWidth={2} />}
              label="WhatsApp"
            />
            <button
              type="button"
              onClick={sendOffer}
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-[11px] bg-primary px-4 py-[11px] font-condensed text-sm font-bold text-primary-foreground"
              style={{ boxShadow: ACCENT_GLOW_SM }}
            >
              <Send className="size-4" strokeWidth={2} />
              Send offer
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
