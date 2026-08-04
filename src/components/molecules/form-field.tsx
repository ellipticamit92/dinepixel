import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends React.ComponentProps<"input"> {
  label: string;
  icon?: LucideIcon;
  trailing?: React.ReactNode;
  labelExtra?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

/**
 * Generic labeled input field (label + icon + input + optional trailing
 * slot/error). Shared across forms — e.g. email/password here, reusable
 * as-is for search, profile, or any other page that needs a text input.
 */
export function FormField({
  label,
  icon: Icon,
  trailing,
  labelExtra,
  error,
  id,
  name,
  className,
  containerClassName,
  ...props
}: FormFieldProps) {
  const inputId = id ?? name;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={inputId}>{label}</Label>
        {labelExtra}
      </div>
      <div className="relative flex items-center">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        ) : null}
        <Input
          id={inputId}
          name={name}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-11 rounded-xl bg-secondary/40 px-3",
            Icon && "pl-9",
            trailing && "pr-9",
            className,
          )}
          {...props}
        />
        {trailing ? (
          <div className="absolute right-3 flex items-center">{trailing}</div>
        ) : null}
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
