"use client";

import EarningsBox from "@/components/stocks/EarningsBox";
import LockedFeatureCard from "@/components/plans/LockedFeatureCard";
import { usePlan } from "@/components/plans/PlanProvider";
import { canAccessFeature } from "@/lib/plans/featureAccess";
import type { NormalizedEarnings } from "@/lib/providers/types";

interface GatedEarningsBoxProps {
  earnings: NormalizedEarnings | null;
}

export default function GatedEarningsBox({ earnings }: GatedEarningsBoxProps) {
  const { plan, hydrated } = usePlan();
  const canSeeFull = hydrated && canAccessFeature(plan, "earnings_summary_full");
  const canSeeProSummary =
    hydrated && canAccessFeature(plan, "advanced_checkpoints");

  if (!earnings) {
    return (
      <div className="card p-5 text-sm text-slate-600">
        현재 제공 가능한 실적 데이터가 없습니다.
      </div>
    );
  }

  if (!canSeeFull) {
    // 무료: 핵심 카드는 보여주되 전년 동기·태그 등 부가 정보는 보이지 않게
    // 제한된 보기 + 베이직 안내 표시
    const limited: NormalizedEarnings = {
      ...earnings,
      revenue: earnings.revenue
        ? { ...earnings.revenue, rawName: null }
        : null,
      operatingProfit: earnings.operatingProfit
        ? { ...earnings.operatingProfit, rawName: null }
        : null,
      netProfit: earnings.netProfit
        ? { ...earnings.netProfit, rawName: null }
        : null,
      yoyRevenue: null,
      yoyOperatingProfit: null,
    };
    return (
      <>
        <EarningsBox earnings={limited} />
        <LockedFeatureCard
          requiredPlan="basic"
          title="실적 상세 요약은 베이직 플랜에서 이용 가능"
          description="전년 동기 대비 변화, 사업부별 흐름 등 상세 실적 요약은 베이직 플랜에서 확인할 수 있습니다."
        />
      </>
    );
  }

  return (
    <>
      <EarningsBox earnings={earnings} />
      {canSeeProSummary && (
        <article className="rounded-xl border border-brand-200 bg-brand-50/50 p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-brand-700 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              PRO
            </span>
            <h4 className="text-sm font-semibold text-slate-900">
              실적 발표 요약
            </h4>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {earnings.period} 보고 기간을 중심으로 사업부문별 흐름과 일회성
            요인을 함께 정리해 확인할 수 있습니다. 컨퍼런스콜에서 언급된 다음
            분기 가이던스 변화도 함께 참고하세요.
          </p>
        </article>
      )}
    </>
  );
}
