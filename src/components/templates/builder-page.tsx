"use client";

import { useEffect, useRef, useState } from "react";
import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { StepIndicator } from "@/components/molecules/step-indicator";
import { BuilderStepUpload } from "@/components/organisms/builder-step-upload";
import { BuilderStepProcessing } from "@/components/organisms/builder-step-processing";
import { BuilderStepReview } from "@/components/organisms/builder-step-review";
import { BuilderStepPublished } from "@/components/organisms/builder-step-published";
import { LivePreviewPhone } from "@/components/organisms/live-preview-phone";
import type { BuilderStep } from "@/lib/builder-state";
import {
  addIngredient,
  flipDishCategory,
  removeIngredient,
  setDishPrice,
} from "@/lib/builder-state";
import { SEED_DISHES, type Dish, type DishCategory } from "@/lib/menu-seed";

const SLUG = "bloom-cafe";

export function BuilderPage() {
  const [step, setStep] = useState<BuilderStep>("upload");
  const [items, setItems] = useState<Dish[]>(SEED_DISHES);
  const [previewTab, setPreviewTab] = useState<DishCategory>("veg");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const generate = () => {
    setStep("processing");
    timerRef.current = setTimeout(() => setStep("review"), 2600);
  };

  const publish = () => setStep("published");
  const backToReview = () => setStep("review");
  const reset = () => {
    setStep("upload");
    setItems(SEED_DISHES);
    setEditingId(null);
    setPreviewTab("veg");
    setFileName(null);
  };

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar />
      <StepIndicator step={step} />

      <div className="mx-auto grid w-full max-w-[1180px] items-start gap-8 px-6 py-6 pb-16 sm:px-10 lg:grid-cols-[1fr_380px]">
        <div>
          {step === "upload" ? (
            <BuilderStepUpload
              fileName={fileName}
              onFileSelected={setFileName}
              onGenerate={generate}
            />
          ) : null}

          {step === "processing" ? <BuilderStepProcessing /> : null}

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
              onPublish={publish}
              onReset={reset}
            />
          ) : null}

          {step === "published" ? (
            <BuilderStepPublished slug={SLUG} onBackToReview={backToReview} />
          ) : null}
        </div>

        <LivePreviewPhone
          items={items}
          tab={previewTab}
          onTabChange={setPreviewTab}
          empty={step === "upload"}
        />
      </div>
    </div>
  );
}
