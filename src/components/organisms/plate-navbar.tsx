"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/atoms/logo";
import { RAISED_SM, INSET, ACCENT_GLOW } from "@/lib/neu-shadows";
import { logout } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";

function NavPill({
  href,
  active,
  onClick,
  className,
  children,
}: {
  href: string;
  active: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-[11px] px-4 py-[9px] font-condensed text-sm font-bold tracking-[0.3px]",
        className
      )}
      style={{
        color: active ? "oklch(0.26 0.02 60)" : "oklch(0.5 0.02 60)",
        boxShadow: active ? INSET : RAISED_SM,
      }}
    >
      {children}
    </Link>
  );
}

export function PlateNavbar({ session }: { session?: { name: string } | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isBuilder = pathname?.startsWith("/builder") ?? false;
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isAuth =
    pathname?.startsWith("/login") || pathname?.startsWith("/signup") || false;
  const isHome = !isBuilder && !isAdmin && !isAuth;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 bg-background px-6 py-4 sm:px-10">
      <div className="flex items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-2.5 md:flex">
          <NavPill href="/" active={isHome}>
            Home
          </NavPill>
          {session ? (
            <>
              <NavPill href="/builder" active={isBuilder}>
                Builder
              </NavPill>
              <NavPill href="/admin" active={isAdmin}>
                Dashboard
              </NavPill>
              <span className="hidden rounded-[11px] px-4 py-[9px] font-condensed text-sm font-bold tracking-[0.3px] text-[oklch(0.5_0.02_60)] lg:inline">
                Hi, {session.name}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-[11px] px-5 py-2.5 font-condensed text-sm font-bold tracking-[0.3px] text-[oklch(0.46_0.02_60)]"
                  style={{ boxShadow: RAISED_SM }}
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-[11px] text-[oklch(0.35_0.02_60)] md:hidden"
          style={{ boxShadow: menuOpen ? INSET : RAISED_SM }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" strokeWidth={2} /> : <Menu className="size-5" strokeWidth={2} />}
        </button>
      </div>

      {menuOpen ? (
        <nav className="mt-3 flex flex-col gap-2 pb-1 md:hidden">
          <NavPill href="/" active={isHome} onClick={closeMenu} className="text-center">
            Home
          </NavPill>
          {session ? (
            <>
              <NavPill href="/builder" active={isBuilder} onClick={closeMenu} className="text-center">
                Builder
              </NavPill>
              <NavPill href="/admin" active={isAdmin} onClick={closeMenu} className="text-center">
                Dashboard
              </NavPill>
              <div className="rounded-[11px] px-4 py-[9px] text-center font-condensed text-sm font-bold tracking-[0.3px] text-[oklch(0.5_0.02_60)]">
                Hi, {session.name}
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full rounded-[11px] px-5 py-2.5 font-condensed text-sm font-bold tracking-[0.3px] text-[oklch(0.46_0.02_60)]"
                  style={{ boxShadow: RAISED_SM }}
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <NavPill href="/login" active={isAuth} onClick={closeMenu} className="text-center">
                Sign in
              </NavPill>
              <Link
                href="/signup"
                onClick={closeMenu}
                className="rounded-[11px] bg-primary px-5 py-2.5 text-center font-condensed text-sm font-bold tracking-[0.3px] text-primary-foreground"
                style={{ boxShadow: ACCENT_GLOW }}
              >
                Get started free
              </Link>
            </>
          )}
        </nav>
      ) : null}
    </header>
  );
}
