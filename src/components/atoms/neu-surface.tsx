import * as React from "react";
import { cn } from "@/lib/utils";

const VARIANT_CLASS = {
  raised: "shadow-neu-raised",
  "raised-sm": "shadow-neu-raised-sm",
  "raised-lg": "shadow-neu-raised-lg",
  "raised-xl": "shadow-neu-raised-xl",
  inset: "shadow-neu-inset",
  "inset-lg": "shadow-neu-inset-lg",
  flat: "",
} as const;

export type NeuVariant = keyof typeof VARIANT_CLASS;

interface NeuSurfaceProps extends React.ComponentProps<"div"> {
  variant?: NeuVariant;
  as?: React.ElementType;
}

export function NeuSurface({
  variant = "raised",
  as: Component = "div",
  className,
  ...props
}: NeuSurfaceProps) {
  return (
    <Component
      className={cn("bg-background", VARIANT_CLASS[variant], className)}
      {...props}
    />
  );
}
