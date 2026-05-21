export type PlanCode = "free" | "basic" | "pro";

export interface PlanLimit {
  code: PlanCode;
  label: string;
  dailyReportViews: number;
  watchlistMax: number;
}

export const PLAN_LIMITS: Record<PlanCode, PlanLimit> = {
  free: {
    code: "free",
    label: "무료",
    dailyReportViews: 3,
    watchlistMax: 5,
  },
  basic: {
    code: "basic",
    label: "베이직",
    dailyReportViews: 50,
    watchlistMax: 50,
  },
  pro: {
    code: "pro",
    label: "프로",
    dailyReportViews: 200,
    watchlistMax: 200,
  },
};

export function getPlanLimit(plan: string | null | undefined): PlanLimit {
  if (plan === "basic") return PLAN_LIMITS.basic;
  if (plan === "pro") return PLAN_LIMITS.pro;
  return PLAN_LIMITS.free;
}
