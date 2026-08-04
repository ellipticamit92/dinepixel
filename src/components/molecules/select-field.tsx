"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface SelectFieldOption {
  label: string;
  value: string;
}

/**
 * Generic labeled select field, the dropdown counterpart to FormField.
 * Reusable anywhere a labeled single-choice picker is needed.
 */
export function SelectField({
  label,
  placeholder,
  options,
  name,
  id,
  defaultValue,
  onValueChange,
  containerClassName,
  triggerClassName,
}: {
  label: string;
  placeholder?: string;
  options: SelectFieldOption[];
  name?: string;
  id?: string;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  containerClassName?: string;
  triggerClassName?: string;
}) {
  const fieldId = id ?? name;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      <Label htmlFor={fieldId}>{label}</Label>
      <Select name={name} defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger
          id={fieldId}
          className={cn("h-11 w-full rounded-xl bg-secondary/40 px-3", triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
