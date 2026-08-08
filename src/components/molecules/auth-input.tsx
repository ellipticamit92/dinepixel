import { INSET } from "@/lib/neu-shadows";

export function AuthInput({
  label,
  icon,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
}: {
  label: string;
  icon: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-[11px] font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase"
      >
        {label}
      </label>
      <div
        className="flex items-center gap-2.5 rounded-[13px] px-[15px] py-[13px]"
        style={{ boxShadow: INSET }}
      >
        <span className="text-sm text-[oklch(0.6_0.04_60)]" aria-hidden>
          {icon}
        </span>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="flex-1 border-none bg-transparent text-[15px] font-semibold text-[oklch(0.26_0.02_60)] outline-none placeholder:text-[oklch(0.6_0.03_60)] placeholder:font-medium"
        />
      </div>
    </div>
  );
}
