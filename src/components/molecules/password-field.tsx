"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { FormField, type FormFieldProps } from "@/components/molecules/form-field";

type PasswordFieldProps = Omit<FormFieldProps, "type" | "icon" | "trailing" | "label"> & {
  label?: string;
};

export function PasswordField({
  label = "Password",
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      {...props}
      label={label}
      type={visible ? "text" : "password"}
      icon={Lock}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}
