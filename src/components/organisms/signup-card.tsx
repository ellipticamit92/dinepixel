import { ArrowRight, Globe, Apple, Mail, User, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/molecules/form-field";
import { PasswordField } from "@/components/molecules/password-field";
import { OAuthButton } from "@/components/molecules/oauth-button";
import { OrDivider } from "@/components/molecules/or-divider";
import { AgreementCheckbox } from "@/components/molecules/agreement-checkbox";

export function SignupCard() {
  return (
    <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join MenuAI to revolutionize your restaurant&apos;s digital
          presence.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <OAuthButton icon={Globe} label="Google" />
        <OAuthButton icon={Apple} label="Apple" />
      </div>

      <OrDivider label="OR CONTINUE WITH EMAIL" />

      <form className="mt-6 flex flex-col gap-5">
        <FormField
          label="Full Name"
          name="name"
          placeholder="Jane Doe"
          icon={User}
          autoComplete="name"
        />
        <FormField
          label="Restaurant Name"
          name="restaurantName"
          placeholder="The Local Bistro"
          icon={UtensilsCrossed}
          autoComplete="organization"
        />
        <FormField
          label="Email Address"
          name="email"
          type="email"
          placeholder="jane@thelocalbistro.com"
          icon={Mail}
          autoComplete="email"
        />
        <PasswordField
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
        />

        <AgreementCheckbox />

        <Button type="submit" size="lg" className="w-full gap-2 rounded-xl">
          Create Account
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-primary hover:underline">
          Log In
        </a>
      </p>
    </div>
  );
}
