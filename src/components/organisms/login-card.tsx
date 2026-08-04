import { ArrowRight, Globe, Apple, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/molecules/form-field";
import { PasswordField } from "@/components/molecules/password-field";
import { OAuthButton } from "@/components/molecules/oauth-button";
import { OrDivider } from "@/components/molecules/or-divider";

export function LoginCard() {
  return (
    <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">
          MenuAI
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, please sign in.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <OAuthButton icon={Globe} label="Continue with Google" className="rounded-full" />
        <OAuthButton icon={Apple} label="Continue with Apple" className="rounded-full" />
      </div>

      <OrDivider label="OR" />

      <form className="mt-6 flex flex-col gap-5">
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          autoComplete="email"
          className="rounded-full"
        />
        <PasswordField
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          className="rounded-full"
          labelExtra={
            <a href="#" className="text-sm font-medium text-primary hover:underline">
              Forgot Password?
            </a>
          }
        />

        <div className="flex items-center gap-2">
          <Checkbox id="remember" name="remember" />
          <Label htmlFor="remember" className="font-normal text-muted-foreground">
            Remember me
          </Label>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2 rounded-full">
          Sign In
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="font-medium text-primary hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
}
