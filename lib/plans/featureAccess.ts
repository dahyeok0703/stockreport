/**
 * 요금제별 기능 접근 권한 표.
 *
 * 각 FeatureKey 마다 "이 기능을 사용하려면 최소 어떤 플랜이 필요한가"를
 * 한 번에 정의합니다. UI 코드는 `canAccessFeature(plan, feature)` 만
 * 호출하면 되고, 후속 단계에서 실제 Supabase profile.plan 으로 교체될 때도
 * 호출부는 그대로 유지됩니다.
 */

import {
  isPlanAtLeast,
  type FeatureKey,
  type UserPlan,
} from "@/lib/plans/types";
import { PLAN_LIMITS } from "@/lib/plans/planLimits";

const REQUIRED_PLAN: Record<FeatureKey, UserPlan> = {
  // Free 기본
  report_view: "free",
  ai_summary: "free",
  disclosure_summary_basic: "free",
  news_summary_basic: "free",
  earnings_summary_basic: "free",
  briefing_basic: "free",
  calendar_basic: "free",
  watchlist: "free",

  // Basic 잠금
  disclosure_summary_full: "basic",
  news_summary_full: "basic",
  earnings_summary_full: "basic",
  briefing_full: "basic",
  calendar_full: "basic",

  // Pro 잠금
  watchlist_daily_briefing: "pro",
  stock_compare: "pro",
  advanced_checkpoints: "pro",
};

export function getRequiredPlan(feature: FeatureKey): UserPlan {
  return REQUIRED_PLAN[feature];
}

export function canAccessFeature(
  plan: UserPlan,
  feature: FeatureKey,
): boolean {
  return isPlanAtLeast(plan, REQUIRED_PLAN[feature]);
}

export function isUpgradeRequired(
  currentPlan: UserPlan,
  feature: FeatureKey,
): boolean {
  return !canAccessFeature(currentPlan, feature);
}

export function planLabel(plan: UserPlan): string {
  return PLAN_LIMITS[plan].label;
}

/** 사용자에게 표시할 "이 기능은 X 플랜에서 이용 가능" 형식의 메시지 */
export function lockMessage(feature: FeatureKey): string {
  const required = getRequiredPlan(feature);
  return `${planLabel(required)} 플랜에서 이용 가능`;
}
