export const PLAN_MENU_LIMITS = {
  starter: 1,
  pro: 10,
  premium: 25,
} as const;

export type UserPlan = keyof typeof PLAN_MENU_LIMITS;

export function menuLimitFor(plan: string): number {
  return PLAN_MENU_LIMITS[plan as UserPlan] ?? PLAN_MENU_LIMITS.starter;
}
