/**
 * 요금제·권한 도메인 타입.
 *
 * 현재 사용자 플랜은 클라이언트 컨텍스트(`PlanProvider`)에서 관리됩니다.
 * 추후 Supabase 세션이 연결되면 동일한 `UserPlan` 값을 `profiles.plan`
 * 컬럼으로 채워 넣으면 됩니다.
 */

export type UserPlan = "free" | "basic" | "pro";

export type FeatureKey =
  | "report_view"
  | "ai_summary"
  | "disclosure_summary_basic"
  | "disclosure_summary_full"
  | "news_summary_basic"
  | "news_summary_full"
  | "earnings_summary_basic"
  | "earnings_summary_full"
  | "briefing_basic"
  | "briefing_full"
  | "watchlist"
  | "watchlist_daily_briefing"
  | "stock_compare"
  | "advanced_checkpoints"
  | "calendar_basic"
  | "calendar_full";

export const PLAN_RANK: Record<UserPlan, number> = {
  free: 0,
  basic: 1,
  pro: 2,
};

export function isPlanAtLeast(current: UserPlan, required: UserPlan): boolean {
  return PLAN_RANK[current] >= PLAN_RANK[required];
}

export function nextPlanAfter(current: UserPlan): UserPlan | null {
  if (current === "free") return "basic";
  if (current === "basic") return "pro";
  return null;
}
