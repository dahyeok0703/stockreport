"use client";

import NormalizedNewsCard from "@/components/stocks/NormalizedNewsCard";
import LockedFeatureCard from "@/components/plans/LockedFeatureCard";
import { usePlan } from "@/components/plans/PlanProvider";
import { canAccessFeature } from "@/lib/plans/featureAccess";
import type { NormalizedNewsItem } from "@/lib/providers/types";

const FREE_LIMIT = 2;

interface GatedNewsListProps {
  news: NormalizedNewsItem[];
}

export default function GatedNewsList({ news }: GatedNewsListProps) {
  const { plan, hydrated } = usePlan();
  const canSeeFull = hydrated && canAccessFeature(plan, "news_summary_full");

  if (news.length === 0) {
    return (
      <div className="card p-5 text-sm text-slate-600">
        현재 제공 가능한 뉴스 데이터가 없습니다.
      </div>
    );
  }

  if (canSeeFull) {
    return (
      <>
        {news.map((n) => (
          <NormalizedNewsCard key={n.id} news={n} />
        ))}
      </>
    );
  }

  const visible = news.slice(0, FREE_LIMIT);
  const hidden = news.length - visible.length;

  return (
    <>
      {visible.map((n) => (
        <NormalizedNewsCard key={n.id} news={n} />
      ))}
      {hidden > 0 && (
        <LockedFeatureCard
          requiredPlan="basic"
          title={`뉴스 흐름 ${hidden}건 더 보기는 베이직 플랜에서 이용 가능`}
          description="뉴스 흐름 전체 보기는 베이직 플랜에서 제공됩니다."
        />
      )}
    </>
  );
}
