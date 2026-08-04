import { ArrowLeft, ArrowRight } from "lucide-react";
import { TestimonialCard } from "@/components/molecules/testimonial-card";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote:
      "The AI scanning is magic. I uploaded our 4-page menu and it was ready for review in less than 2 minutes. Saved me hours of typing!",
    name: "Marco Rossi",
    role: "Owner, Bella Cucina",
  },
  {
    quote:
      "Updating specials is now a breeze. I just change it on the dashboard and our QR codes on the tables update instantly. My staff loves it.",
    name: "Sarah Jenkins",
    role: "Manager, The Green Leaf",
  },
  {
    quote:
      "Professional, clean, and fast. Our customers compliment the digital menu layout. Best investment we made this year.",
    name: "Chef David Kao",
    role: "Executive Chef, Umami Bar",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Trusted by 2,000+ Restaurant Owners
        </h2>
        <div className="hidden items-center gap-2 sm:flex">
          <Button
            size="icon"
            variant="outline"
            className="size-9 rounded-full"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-9 rounded-full"
            aria-label="Next testimonial"
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </section>
  );
}
