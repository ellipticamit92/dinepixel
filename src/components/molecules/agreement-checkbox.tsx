import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function AgreementCheckbox({
  id = "agree-to-terms",
  name = "agreeToTerms",
  termsHref = "#",
  privacyHref = "#",
}: {
  id?: string;
  name?: string;
  termsHref?: string;
  privacyHref?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Checkbox id={id} name={name} className="mt-0.5" />
      <Label htmlFor={id} className="font-normal text-muted-foreground">
        I agree to the{" "}
        <a href={termsHref} className="font-medium text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href={privacyHref} className="font-medium text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </Label>
    </div>
  );
}
