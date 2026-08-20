// Neumorphic shadow presets for the warm Dinepixel theme, ported 1:1 from the
// design prototype's RAISED / RAISED_SM / INSET constants (oklch shadow pair
// = --shadow-dark / --shadow-light from globals.css).

export const RAISED =
  "6px 6px 14px oklch(0.85 0.02 72), -6px -6px 14px oklch(0.99 0.008 88)";
export const RAISED_SM =
  "4px 4px 10px oklch(0.86 0.02 74), -4px -4px 10px oklch(0.99 0.008 88)";
export const RAISED_LG =
  "8px 8px 18px oklch(0.84 0.022 72), -8px -8px 18px oklch(0.99 0.008 88)";
export const RAISED_XL =
  "14px 14px 34px oklch(0.83 0.025 72), -14px -14px 34px oklch(0.99 0.008 88)";
export const INSET =
  "inset 3px 3px 7px oklch(0.85 0.02 72), inset -3px -3px 7px oklch(0.99 0.008 88)";
export const INSET_SM =
  "inset 2px 2px 5px oklch(0.86 0.02 74), inset -2px -2px 5px oklch(0.99 0.008 88)";
export const INSET_LG =
  "inset 6px 6px 16px oklch(0.85 0.02 72), inset -6px -6px 16px oklch(0.99 0.008 88)";

export const ACCENT_GLOW =
  "7px 7px 16px oklch(0.62 0.17 42 / 0.4), -4px -4px 12px oklch(0.99 0.008 88)";
export const ACCENT_GLOW_SM =
  "6px 6px 14px oklch(0.62 0.17 42 / 0.35), -4px -4px 12px oklch(0.99 0.008 88)";
export const SUCCESS_GLOW =
  "6px 6px 14px oklch(0.62 0.14 150 / 0.35), -4px -4px 12px oklch(0.99 0.008 88)";

export function shadowFor(active: boolean, on = INSET, off = RAISED_SM) {
  return active ? on : off;
}
