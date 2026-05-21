// Back-compat 어댑터. 새 코드는 `@/lib/plans/*` 에서 직접 import 하세요.

export {
  PLAN_LIMITS,
  getPlanLimit,
  getLimit,
  type PlanLimit,
} from "@/lib/plans/planLimits";
export type { UserPlan, FeatureKey } from "@/lib/plans/types";

// 과거 코드에서 사용하던 별칭 — 새 코드에서는 사용하지 마세요.
export type PlanCode = "free" | "basic" | "pro";
