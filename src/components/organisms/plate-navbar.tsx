"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/atoms/logo";
import { RAISED_SM, INSET, ACCENT_GLOW } from "@/lib/neu-shadows";

function NavPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-[11px] px-4 py-[9px] font-condensed text-sm font-bold tracking-[0.3px]"
      style={{
        color: active ? "oklch(0.26 0.02 60)" : "oklch(0.5 0.02 60)",
        boxShadow: active ? INSET : RAISED_SM,
      }}
    >
      {children}
    </Link>
  );
}

export function PlateNavbar() {
  const pathname = usePathname();
  const isBuilder = pathname?.startsWith("/builder") ?? false;
  const isAuth =
    pathname?.startsWith("/login") || pathname?.startsWith("/signup") || false;
  const isHome = !isBuilder && !isAuth;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-background px-6 py-4 sm:px-10">
      <Logo />
      <div className="flex items-center gap-2.5">
        <NavPill href="/" active={isHome}>
          Home
        </NavPill>
        <NavPill href="/builder" active={isBuilder}>
          Builder
        </NavPill>
        <NavPill href="/login" active={isAuth}>
          Sign in
        </NavPill>
        <Link
          href="/signup"
          className="ml-1.5 rounded-[11px] bg-primary px-5 py-2.5 font-condensed text-sm font-bold tracking-[0.3px] text-primary-foreground"
          style={{ boxShadow: ACCENT_GLOW }}
        >
          Get started free
        </Link>
      </div>
    </header>
  );
}
