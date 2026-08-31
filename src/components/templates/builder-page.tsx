"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { StepIndicator } from "@/components/molecules/step-indicator";
import { BuilderStepUpload } from "@/components/organisms/builder-step-upload";
import {
  BuilderStepProcessing,
  type ProcessingStatus,
} from "@/components/organisms/builder-step-processing";
import { BuilderStepReview } from "@/components/organisms/builder-step-review";
import { BuilderStepPublished } from "@/components/organisms/builder-step-published";
import { LivePreviewPhone } from "@/components/organisms/live-preview-phone";
import type { BuilderStep } from "@/lib/builder-state";
import {
  addIngredient,
  flipDishCategory,
  removeIngredient,
  setDishFullPrice,
  setDishHalfPrice,
  setDishLargePrice,
  setDishMediumPrice,
  setDishPrice,
  setDishSmallPrice,
  setPricingMode,
} from "@/lib/builder-state";
import { createExtractionJob, dishesFromMenu, pollExtractionJob } from "@/lib/menulens";
import { saveExtractedMenu } from "@/lib/menu-actions";
import type { Dish, DishCategory } from "@/lib/menu-seed";

function toSlug(name: string | null): string {
  if (!name) return "my-menu";
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "my-menu";
}

interface BuilderPageProps {
  session: { name: string };
  plan: string;
  menuCount: number;
  menuLimit: number;
}

export function BuilderPage({ session, plan, menuCount, menuLimit }: BuilderPageProps) {
  const [step, setStep] = useState<BuilderStep>("upload");
  const [items, setItems] = useState<Dish[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>("uploading");
  const [slug, setSlug] = useState<string>("my-menu");
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  const handleFileSelected = (selected: File) => {
    setFile(selected);
    setFileName(selected.name);
  };

  const generate = async () => {
    if (!file) {
      toast.error("Choose a menu photo or PDF first");
      return;
    }
    setStep("processing");
    setStatus("uploading");
    try {
      const job = await createExtractionJob(file);
      setStatus(job.status);
      const menu = await pollExtractionJob(job.job_id, { onStatus: setStatus });
      const dishes = dishesFromMenu(menu);
      if (dishes.length === 0) {
        toast.error("No dishes found in that file — try another one");
        setStep("upload");
        return;
      }
      const derivedSlug = toSlug(menu.restaurant_name);
      setSlug(derivedSlug);
      setRestaurantName(menu.restaurant_name ?? null);
      setItems(dishes);
      setStep("review");

      try {
        await saveExtractedMenu({
          slug: derivedSlug,
          restaurantName: menu.restaurant_name,
          sourceFileName: file.name,
          sourceNotes: menu.source_notes,
          dishes,
        });
      } catch {
        toast.error("Menu extracted, but couldn't be saved to your account");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Couldn't read that menu";
      if (msg.startsWith("PLAN_LIMIT:")) {
        const [, userPlan, limit] = msg.split(":");
        toast.error(
          `You've reached the ${limit}-menu limit on the ${userPlan} plan. Upgrade to add more menus.`
        );
      } else {
        toast.error(msg);
      }
      setStep("upload");
    }
  };

  const publish = () => setStep("published");
  const backToReview = () => setStep("review");
  const reset = () => {
    setStep("upload");
    setItems([]);
    setEditingId(null);
    setFile(null);
    setFileName(null);
    setSlug("my-menu");
    setRestaurantName(null);
  };

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar session={session} />
      <div className="flex items-center justify-end gap-2 px-6 pt-3 sm:px-10">
        <span className="rounded-full border border-[oklch(0.82_0.04_60)] bg-[oklch(0.97_0.01_60)] px-3 py-1 text-[12px] font-semibold capitalize text-[oklch(0.45_0.05_60)]">
          {plan}
        </span>
        <span className="text-[12px] text-muted-foreground">
          {menuCount}/{menuLimit} {menuCount === 1 ? "menu" : "menus"}
        </span>
        {menuCount >= menuLimit && plan === "free" && (
          <span className="rounded-full bg-[oklch(0.62_0.17_42)] px-3 py-1 text-[11px] font-bold text-white">
            Upgrade for more
          </span>
        )}
      </div>
      <StepIndicator step={step} />

      <div className="mx-auto grid w-full max-w-[1180px] items-start gap-8 px-6 py-6 pb-16 sm:px-10 lg:grid-cols-[1fr_380px]">
        <div>
          {step === "upload" ? (
            <BuilderStepUpload
              fileName={fileName}
              onFileSelected={handleFileSelected}
              onGenerate={generate}
            />
          ) : null}

          {step === "processing" ? (
            <BuilderStepProcessing fileName={fileName} status={status} />
          ) : null}

          {step === "review" ? (
            <BuilderStepReview
              items={items}
              editingId={editingId}
              drafts={drafts}
              onFlip={(id) => setItems((prev) => flipDishCategory(prev, id))}
              onToggleEdit={(id) =>
                setEditingId((prev) => (prev === id ? null : id))
              }
              onSetPrice={(id, price) =>
                setItems((prev) => setDishPrice(prev, id, price))
              }
              onSetHalfPrice={(id, price) =>
                setItems((prev) => setDishHalfPrice(prev, id, price))
              }
              onSetFullPrice={(id, price) =>
                setItems((prev) => setDishFullPrice(prev, id, price))
              }
              onSetSmallPrice={(id, price) =>
                setItems((prev) => setDishSmallPrice(prev, id, price))
              }
              onSetMediumPrice={(id, price) =>
                setItems((prev) => setDishMediumPrice(prev, id, price))
              }
              onSetLargePrice={(id, price) =>
                setItems((prev) => setDishLargePrice(prev, id, price))
              }
              onSetPricingMode={(id, mode) =>
                setItems((prev) => setPricingMode(prev, id, mode))
              }
              onDraftChange={(id, value) =>
                setDrafts((prev) => ({ ...prev, [id]: value }))
              }
              onAddIngredient={(id) => {
                const value = drafts[id] ?? "";
                setItems((prev) => addIngredient(prev, id, value));
                setDrafts((prev) => ({ ...prev, [id]: "" }));
              }}
              onRemoveIngredient={(id, index) =>
                setItems((prev) => removeIngredient(prev, id, index))
              }
              onSave={(id) => {
                setEditingId(null);
                const dish = items.find((d) => d.id === id);
                toast.success(dish ? `${dish.name} updated` : "Dish updated");
              }}
              onPublish={publish}
              onReset={reset}
            />
          ) : null}

          {step === "published" ? (
            <BuilderStepPublished slug={slug} onBackToReview={backToReview} />
          ) : null}
        </div>

        <LivePreviewPhone
          items={items}
          empty={step === "upload"}
          cafeName={restaurantName}
        />
      </div>
    </div>
  );
}
