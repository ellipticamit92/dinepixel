import Link from "next/link";
import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { RAISED_SM } from "@/lib/neu-shadows";

const SECTIONS = [
  {
    heading: "1. Acceptance of terms",
    body: "By creating an account or publishing a menu with Dinepixel, you agree to these Terms & Conditions. If you don't agree, please don't use the service.",
  },
  {
    heading: "2. What Dinepixel does",
    body: "Dinepixel lets restaurants and cafes turn a photo or PDF of their menu into a live, shareable menu page and QR code. We read and structure the content you upload; we don't guarantee perfect accuracy of AI-extracted text.",
  },
  {
    heading: "3. Your content",
    body: "You keep ownership of the menus, dish details, logos, and banner images you upload. You're responsible for making sure you have the right to use and publish that content, and that prices and descriptions shown to your guests are accurate.",
  },
  {
    heading: "4. Acceptable use",
    body: "Don't upload content that is unlawful, infringing, or misleading, and don't use Dinepixel to publish anything other than a genuine restaurant or cafe menu.",
  },
  {
    heading: "5. Availability",
    body: "We aim to keep published menu pages available at all times but don't guarantee uninterrupted access. We may update or change the service, and will try to give notice of changes that affect published menus.",
  },
  {
    heading: "6. Limitation of liability",
    body: "Dinepixel is provided as-is. We aren't liable for losses arising from menu inaccuracies, downtime, or third-party services (such as the AI extraction provider) that Dinepixel relies on.",
  },
  {
    heading: "7. Changes to these terms",
    body: "We may update these terms from time to time. Continued use of Dinepixel after a change means you accept the updated terms.",
  },
  {
    heading: "8. Contact",
    body: "Questions about these terms? Reach out to the team through the contact details on your Dinepixel account.",
  },
];

export function TermsPage({ session }: { session?: { name: string } | null }) {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar session={session} />
      <main className="mx-auto w-full max-w-[760px] px-6 py-10 sm:px-10 sm:py-14">
        <Link
          href="/"
          className="text-[13px] font-bold tracking-[0.3px] text-[oklch(0.5_0.02_60)] hover:text-primary"
        >
          ← Back home
        </Link>
        <h1 className="mt-4 font-display text-[32px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[40px]">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2.5 text-[14.5px] text-muted-foreground">Last updated August 2026.</p>

        <div className="mt-8 flex flex-col gap-5">
          {SECTIONS.map((s) => (
            <div
              key={s.heading}
              className="rounded-2xl bg-background p-[22px]"
              style={{ boxShadow: RAISED_SM }}
            >
              <h2 className="font-display text-lg tracking-[0.2px] text-[oklch(0.26_0.02_60)]">
                {s.heading}
              </h2>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-muted-foreground text-pretty">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
