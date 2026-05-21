"use client";

import FilingCard from "@/components/stocks/FilingCard";
import LockedFeatureCard from "@/components/plans/LockedFeatureCard";
import { usePlan } from "@/components/plans/PlanProvider";
import { canAccessFeature } from "@/lib/plans/featureAccess";
import type { NormalizedFiling } from "@/lib/providers/types";

const FREE_LIMIT = 2;

interface GatedFilingsListProps {
  filings: NormalizedFiling[];
}

export default function GatedFilingsList({ filings }: GatedFilingsListProps) {
  const { plan, hydrated } = usePlan();
  // hydration 전에는 안전하게 무료 사용자 기준으로 표시
  const canSeeFull =
    hydrated && canAccessFeature(plan, "disclosure_summary_full");

  if (filings.length === 0) {
    return (
      <div className="card p-5 text-sm text-slate-600">
        현재 제공 가능한 공시 데이터가 없습니다.
      </div>
    );
  }

  if (canSeeFull) {
    return (
      <>
        {filings.map((f) => (
          <FilingCard key={f.id} filing={f} />
        ))}
      </>
    );
  }

  const visible = filings.slice(0, FREE_LIMIT);
  const hidden = filings.length - visible.length;

  return (
    <>
      {visible.map((f) => (
        <FilingCard key={f.id} filing={f} />
      ))}
      {hidden > 0 && (
        <LockedFeatureCard
          requiredPlan="basic"
          title={`공시 ${hidden}건 더 보기는 베이직 플랜에서 이용 가능`}
          description="전체 공시 요약은 베이직 플랜에서 확인할 수 있습니다. 요금제를 변경하면 모든 공시를 한 번에 확인할 수 있습니다."
        />
      )}
    </>
  );
}
