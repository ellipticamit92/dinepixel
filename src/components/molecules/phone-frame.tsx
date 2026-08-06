import * as React from "react";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
  screenStyle?: React.CSSProperties;
  float?: boolean;
}

export function PhoneFrame({
  children,
  className,
  screenClassName,
  screenStyle,
  float = false,
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "rounded-[42px] bg-background p-3 shadow-neu-raised-xl",
        float && "animate-pl-float",
        className
      )}
    >
      <div
        className={cn(
          "flex h-[600px] flex-col overflow-hidden rounded-[30px]",
          screenClassName
        )}
        style={{
          boxShadow:
            "inset 3px 3px 8px oklch(0.86 0.02 74), inset -2px -2px 6px oklch(0.99 0.008 88)",
          ...screenStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
