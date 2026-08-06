import Link from "next/link";

export function LandingFooter() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 pb-10 sm:px-10">
      <div className="flex flex-col items-center justify-between gap-3 text-[13px] font-semibold text-[oklch(0.55_0.03_60)] sm:flex-row">
        <span>© 2026 Plate</span>
        <span className="flex gap-5">
          <Link href="/menu/the-bistro" className="hover:text-primary">
            Example menu
          </Link>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </span>
      </div>
    </div>
  );
}
