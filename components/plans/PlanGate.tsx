"use client";

import { canAccessFeature, getRequiredPlan } from "@/lib/plans/featureAccess";
import { usePlan } from "@/components/plans/PlanProvider";
import LockedFeatureCard from "@/components/plans/LockedFeatureCard";
import type { FeatureKey } from "@/lib/plans/types";

interface PlanGateProps {
  feature: FeatureKey;
  /** 권한이 있을 때 렌더링할 콘텐츠 */
  children: React.ReactNode;
  /** 권한이 없을 때 렌더링할 fallback. 미지정 시 기본 LockedFeatureCard */
  fallback?: React.ReactNode;
  /** 권한이 없을 때 LockedFeatureCard의 variant */
  lockVariant?: "default" | "inline";
  /** 권한이 없을 때 표시할 사용자 친화 제목 */
  lockTitle?: string;
  /** 보조 설명 */
  lockDescription?: string;
}

export default function PlanGate({
  feature,
  children,
  fallback,
  lockVariant,
  lockTitle,
  lockDescription,
}: PlanGateProps) {
  const { plan } = usePlan();
  if (canAccessFeature(plan, feature)) {
    return <>{children}</>;
  }
  if (fallback !== undefined) return <>{fallback}</>;
  return (
    <LockedFeatureCard
      requiredPlan={getRequiredPlan(feature)}
      title={lockTitle}
      description={lockDescription}
      variant={lockVariant}
    />
  );
}
