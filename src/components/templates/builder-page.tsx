"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { createExtractionJob, dishesFromMenu, pollExtractionJob } from "@/lib/menulens";
import { SEED_DISHES, type Dish, type DishCategory } from "@/lib/menu-seed";

const SLUG = "bloom-cafe";

export function BuilderPage({ session }: { session: { name: string } }) {
  const [step, setStep] = useState<BuilderStep>("upload");
  const [items, setItems] = useState<Dish[]>(SEED_DISHES);
  const [previewTab, setPreviewTab] = useState<DishCategory>("veg");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

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
    try {
      const job = await createExtractionJob(file);
      const menu = await pollExtractionJob(job.job_id);
      const dishes = dishesFromMenu(menu);
      if (dishes.length === 0) {
        toast.error("No dishes found in that file — try another one");
        setStep("upload");
        return;
      }
      setItems(dishes);
      setStep("review");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't read that menu");
      setStep("upload");
    }
  };

  const publish = () => setStep("published");
  const backToReview = () => setStep("review");
  const reset = () => {
    setStep("upload");
    setItems(SEED_DISHES);
    setEditingId(null);
    setPreviewTab("veg");
    setFile(null);
    setFileName(null);
  };

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar session={session} />
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
