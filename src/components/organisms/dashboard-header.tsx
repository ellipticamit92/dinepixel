import { Logo } from "@/components/atoms/logo";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-6 sm:px-10">
      <div className="rounded-2xl bg-card px-4 py-2 shadow-sm">
        <Logo />
      </div>
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
        >
          Need help?
        </a>
        <Button variant="secondary" size="sm" className="rounded-full">
          Contact Support
        </Button>
      </div>
    </header>
  );
}
