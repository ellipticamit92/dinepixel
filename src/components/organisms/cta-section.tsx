import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-secondary px-8 py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Ready to Go Digital?
        </h2>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          Join thousands of restaurants saving time and delighting customers.
          Start your first menu for free today.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg">Create My Free Menu</Button>
          <Button size="lg" variant="outline">
            Schedule a Call
          </Button>
        </div>
      </div>
    </section>
  );
}
