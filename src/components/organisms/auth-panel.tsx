import Link from "next/link";
import { Apple } from "lucide-react";
import { AuthInput } from "@/components/molecules/auth-input";
import { RAISED_SM, INSET, ACCENT_GLOW } from "@/lib/neu-shadows";
import { login, register } from "@/lib/auth-actions";

export type AuthMode = "login" | "register";

const CARD_SHADOW =
  "10px 10px 26px oklch(0.83 0.025 72), -10px -10px 26px oklch(0.99 0.008 88)";

const COPY: Record<
  AuthMode,
  {
    badge: string;
    headline: [string, string];
    sub: string;
    perks: string[];
    cta: string;
    switchText: string;
    switchLink: string;
    switchHref: string;
  }
> = {
  login: {
    badge: "Welcome back",
    headline: ["Sign in to", "your menus."],
    sub: "Pick up where you left off — edit dishes, prices and republish in seconds.",
    perks: [
      "Your menus, live and editable",
      "Instant QR + WhatsApp link",
      "Changes update with no reprint",
    ],
    cta: "Sign in",
    switchText: "New to Dinepixel?",
    switchLink: "Create an account",
    switchHref: "/signup",
  },
  register: {
    badge: "Free forever plan",
    headline: ["Create your", "Dinepixel account."],
    sub: "Upload your first menu and get a live page with a QR code in under a minute.",
    perks: [
      "No credit card required",
      "AI reads & sorts Veg / Non-Veg",
      "Your first menu is free",
    ],
    cta: "Create account",
    switchText: "Already have an account?",
    switchLink: "Sign in",
    switchHref: "/login",
  },
};

export function AuthPanel({
  mode,
  next = "/admin",
  error,
}: {
  mode: AuthMode;
  next?: string;
  error?: string;
}) {
  const copy = COPY[mode];
  const isLogin = mode === "login";
  const nextQuery = next && next !== "/admin" ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
      {/* left brand panel */}
      <div className="hidden flex-col justify-center gap-[26px] px-14 py-16 lg:flex">
        <div>
          <div
            className="inline-flex items-center gap-[9px] rounded-full px-4 py-[9px] text-[12.5px] font-bold tracking-[0.4px] text-accent-foreground"
            style={{ boxShadow: INSET }}
          >
            <span className="size-2 rounded-full bg-primary" />
            {copy.badge}
          </div>
          <h1 className="mt-5 font-display text-[46px] leading-[1] tracking-[0.3px] text-[oklch(0.24_0.02_60)]">
            {copy.headline[0]}
            <br />
            {copy.headline[1]}
          </h1>
          <p className="mt-4 max-w-[400px] text-base leading-[1.5] text-muted-foreground text-pretty">
            {copy.sub}
          </p>
        </div>
        <div className="flex flex-col gap-3.5">
          {copy.perks.map((perk) => (
            <div key={perk} className="flex items-center gap-[13px]">
              <div
                className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] text-sm font-extrabold text-[oklch(0.45_0.13_150)]"
                style={{ boxShadow: RAISED_SM }}
              >
                ✓
              </div>
              <span className="text-[14.5px] font-semibold text-[oklch(0.4_0.02_60)]">
                {perk}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* right form card */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
        <div
          className="w-full max-w-[400px] rounded-[26px] bg-background p-[34px]"
          style={{ boxShadow: CARD_SHADOW }}
        >
          {/* tab toggle */}
          <div className="flex gap-2 rounded-[15px] p-1.5" style={{ boxShadow: INSET }}>
            <Link
              href={`/login${nextQuery}`}
              className="flex-1 rounded-[11px] py-[11px] text-center font-condensed text-[14.5px] font-bold tracking-[0.3px]"
              style={{
                color: isLogin ? "oklch(0.26 0.02 60)" : "oklch(0.52 0.02 60)",
                boxShadow: isLogin ? INSET : RAISED_SM,
              }}
            >
              Sign in
            </Link>
            <Link
              href={`/signup${nextQuery}`}
              className="flex-1 rounded-[11px] py-[11px] text-center font-condensed text-[14.5px] font-bold tracking-[0.3px]"
              style={{
                color: !isLogin ? "oklch(0.26 0.02 60)" : "oklch(0.52 0.02 60)",
                boxShadow: !isLogin ? INSET : RAISED_SM,
              }}
            >
              Register
            </Link>
          </div>

          <form className="mt-6 flex flex-col gap-4" action={isLogin ? login : register}>
            <input type="hidden" name="next" value={next} />

            {error ? (
              <div
                className="rounded-[11px] px-3.5 py-2.5 text-[13px] font-semibold"
                style={{ color: "var(--nonveg)", boxShadow: INSET }}
              >
                Enter both an email and password to continue.
              </div>
            ) : null}

            {!isLogin ? (
              <AuthInput
                label="Cafe / Restaurant name"
                icon="⌂"
                name="restaurantName"
                placeholder="Bloom Cafe"
                autoComplete="organization"
              />
            ) : null}

            <AuthInput
              label="Email"
              icon="✉"
              name="email"
              type="email"
              placeholder="you@cafe.com"
              autoComplete="email"
              required
            />

            <AuthInput
              label="Password"
              icon="🔒"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />

            {isLogin ? (
              <div className="flex items-center justify-between text-[13px]">
                <label className="flex cursor-pointer items-center gap-2 font-semibold text-[oklch(0.48_0.02_60)]">
                  <span className="relative inline-flex">
                    <input
                      type="checkbox"
                      name="remember"
                      className="peer sr-only"
                    />
                    <span
                      className="block size-[18px] rounded-[6px] shadow-neu-inset peer-checked:bg-primary peer-checked:shadow-none"
                    />
                  </span>
                  Remember me
                </label>
                <a href="#" className="font-bold text-accent-foreground">
                  Forgot password?
                </a>
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-1 block w-full rounded-[14px] py-[15px] text-center font-condensed text-base font-bold tracking-[0.4px] text-primary-foreground"
              style={{ background: "var(--primary)", boxShadow: ACCENT_GLOW }}
            >
              {copy.cta}
            </button>

            <div className="my-0.5 flex items-center gap-3">
              <span className="h-px flex-1 bg-[oklch(0.86_0.02_74)]" />
              <span className="text-xs font-semibold text-[oklch(0.6_0.03_60)]">
                or continue with
              </span>
              <span className="h-px flex-1 bg-[oklch(0.86_0.02_74)]" />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2.5 rounded-[13px] py-[13px] font-condensed text-sm font-bold text-[oklch(0.4_0.02_60)]"
                style={{ boxShadow: RAISED_SM }}
              >
                <span className="text-[15px] font-bold">G</span>
                Google
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2.5 rounded-[13px] py-[13px] font-condensed text-sm font-bold text-[oklch(0.4_0.02_60)]"
                style={{ boxShadow: RAISED_SM }}
              >
                <Apple className="size-[15px]" strokeWidth={2} />
                Apple
              </button>
            </div>

            <div className="text-center text-[13.5px] font-semibold text-[oklch(0.5_0.02_60)]">
              {copy.switchText}{" "}
              <Link href={`${copy.switchHref}${nextQuery}`} className="font-bold text-accent-foreground">
                {copy.switchLink}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
