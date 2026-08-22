// Neumorphic shadow presets, built from the theme's --shadow-dark / --shadow-dark-deep /
// --shadow-light CSS variables (globals.css). Referencing the variables (rather than baking
// in literal colors) is what lets a `[data-menu-theme]` wrapper re-skin every shadow beneath it.

export const RAISED = "6px 6px 14px var(--shadow-dark), -6px -6px 14px var(--shadow-light)";
export const RAISED_SM = "4px 4px 10px var(--shadow-dark), -4px -4px 10px var(--shadow-light)";
export const RAISED_LG = "8px 8px 18px var(--shadow-dark-deep), -8px -8px 18px var(--shadow-light)";
export const RAISED_XL = "14px 14px 34px var(--shadow-dark-deep), -14px -14px 34px var(--shadow-light)";
export const INSET = "inset 3px 3px 7px var(--shadow-dark), inset -3px -3px 7px var(--shadow-light)";
export const INSET_SM = "inset 2px 2px 5px var(--shadow-dark), inset -2px -2px 5px var(--shadow-light)";
export const INSET_LG = "inset 6px 6px 16px var(--shadow-dark), inset -6px -6px 16px var(--shadow-light)";

export const ACCENT_GLOW = "7px 7px 16px var(--primary-glow), -4px -4px 12px var(--shadow-light)";
export const ACCENT_GLOW_SM = "6px 6px 14px var(--primary-glow), -4px -4px 12px var(--shadow-light)";
export const SUCCESS_GLOW = "6px 6px 14px var(--success-glow), -4px -4px 12px var(--shadow-light)";

export function shadowFor(active: boolean, on = INSET, off = RAISED_SM) {
  return active ? on : off;
}
