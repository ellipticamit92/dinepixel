import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/molecules/form-field";
import { SelectField, type SelectFieldOption } from "@/components/molecules/select-field";
import { Dropzone } from "@/components/molecules/dropzone";

const cuisines: SelectFieldOption[] = [
  "Italian",
  "American",
  "Mexican",
  "Japanese",
  "Indian",
  "French",
  "Mediterranean",
  "Other",
].map((label) => ({ label, value: label.toLowerCase() }));

export function UploadStepCard() {
  return (
    <div className="rounded-3xl border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Welcome, Chef!
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Let&apos;s get your menu digitized in seconds. Tell us about your
        restaurant first.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Restaurant Name"
          name="restaurantName"
          placeholder="e.g. The Golden Bistro"
        />
        <SelectField
          label="Cuisine Type"
          name="cuisine"
          placeholder="Select Cuisine"
          options={cuisines}
        />
      </div>

      <Dropzone className="mt-6" />

      <div className="mt-6 flex justify-end">
        <Button size="lg" className="gap-2 rounded-xl">
          Next: Analyze Menu
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
