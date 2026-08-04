import { DashboardHeader } from "@/components/organisms/dashboard-header";
import { DashboardFooter } from "@/components/organisms/dashboard-footer";
import { UploadStepCard } from "@/components/organisms/upload-step-card";
import { MenuPreviewPanel } from "@/components/organisms/menu-preview-panel";
import { Stepper } from "@/components/molecules/stepper";

const steps = ["Upload", "AI Review", "Publish"];

export function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-br from-background via-background to-secondary/40">
      <DashboardHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 sm:px-10">
        <Stepper steps={steps} currentStep={1} className="mb-10" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <UploadStepCard />
          <MenuPreviewPanel />
        </div>
      </main>
      <DashboardFooter />
    </div>
  );
}
