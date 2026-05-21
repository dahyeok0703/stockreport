"use client";

import FinancialTable from "@/components/stocks/FinancialTable";
import LockedFeatureCard from "@/components/plans/LockedFeatureCard";
import { usePlan } from "@/components/plans/PlanProvider";
import { canAccessFeature } from "@/lib/plans/featureAccess";
import type { NormalizedFinancialMetric } from "@/lib/providers/types";

const FREE_LIMIT = 3;

interface GatedFinancialsProps {
  metrics: NormalizedFinancialMetric[];
}

export default function GatedFinancials({ metrics }: GatedFinancialsProps) {
  const { plan, hydrated } = usePlan();
  const canSeeFull = hydrated && canAccessFeature(plan, "earnings_summary_full");

  if (metrics.length === 0) {
    return (
      <div className="card p-5 text-sm text-slate-600">
        현재 제공 가능한 재무 데이터가 없습니다.
      </div>
    );
  }

  if (canSeeFull) {
    return <FinancialTable metrics={metrics} />;
  }

  const visible = metrics.slice(0, FREE_LIMIT);
  const hidden = metrics.length - visible.length;
  return (
    <>
      <FinancialTable metrics={visible} />
      {hidden > 0 && (
        <LockedFeatureCard
          requiredPlan="basic"
          title="재무 핵심지표 전체 보기는 베이직 플랜에서 이용 가능"
          description={`PER·PBR·부채비율 등 ${hidden}개 지표를 베이직 플랜에서 추가로 확인할 수 있습니다.`}
        />
      )}
    </>
  );
}
