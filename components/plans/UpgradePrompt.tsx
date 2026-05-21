"use client";

import Link from "next/link";
import { usePlan } from "@/components/plans/PlanProvider";
import { nextPlanAfter } from "@/lib/plans/types";
import { planLabel } from "@/lib/plans/featureAccess";

/**
 * 가벼운 요금제 변경 안내 띠. 페이지 상단/하단에 끼워 넣을 수 있습니다.
 * 이미 최고 플랜이라면 표시되지 않습니다.
 */
export default function UpgradePrompt({
  title,
  cta = "요금제 보기",
}: {
  title?: string;
  cta?: string;
}) {
  const { plan, hydrated } = usePlan();
  if (!hydrated) return null;
  const next = nextPlanAfter(plan);
  if (!next) return null;

  const headline =
    title ??
    `${planLabel(next)} 플랜에서 더 많은 정보를 확인할 수 있습니다.`;

  return (
    <div className="flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-700">{headline}</p>
      <Link href="/pricing" className="btn-outline text-xs">
        {cta}
      </Link>
    </div>
  );
}
