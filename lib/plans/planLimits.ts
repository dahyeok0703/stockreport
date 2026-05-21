import type { UserPlan } from "@/lib/plans/types";

export type LimitKey =
  | "dailyReportViews"
  | "dailyAiSummaries"
  | "watchlistLimit";

export interface PlanLimit {
  code: UserPlan;
  label: string;
  price: string;
  dailyReportViews: number;
  dailyAiSummaries: number;
  watchlistLimit: number;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimit> = {
  free: {
    code: "free",
    label: "무료",
    price: "0원",
    dailyReportViews: 3,
    dailyAiSummaries: 3,
    watchlistLimit: 5,
  },
  basic: {
    code: "basic",
    label: "베이직",
    price: "9,900원",
    dailyReportViews: 50,
    dailyAiSummaries: 50,
    watchlistLimit: 50,
  },
  pro: {
    code: "pro",
    label: "프로",
    price: "19,900원",
    dailyReportViews: 200,
    dailyAiSummaries: 200,
    watchlistLimit: 200,
  },
};

export function getPlanLimit(plan: UserPlan | string | null | undefined): PlanLimit {
  if (plan === "basic") return PLAN_LIMITS.basic;
  if (plan === "pro") return PLAN_LIMITS.pro;
  return PLAN_LIMITS.free;
}

export function getLimit(
  plan: UserPlan | string | null | undefined,
  key: LimitKey,
): number {
  return getPlanLimit(plan)[key];
}
