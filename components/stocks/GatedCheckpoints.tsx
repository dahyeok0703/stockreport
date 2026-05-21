"use client";

import LockedFeatureCard from "@/components/plans/LockedFeatureCard";
import { usePlan } from "@/components/plans/PlanProvider";
import { canAccessFeature } from "@/lib/plans/featureAccess";

interface CheckpointGroup {
  title: string;
  items: string[];
}

interface GatedCheckpointsProps {
  groups: CheckpointGroup[];
}

const FREE_PER_GROUP = 2;

const ADVANCED_GROUPS: CheckpointGroup[] = [
  {
    title: "재무에서 확인할 점",
    items: [
      "전년 동기 대비 매출·이익 변화 폭과 일관성",
      "영업현금흐름과 회계 이익의 괴리 여부",
      "부채 만기 구조와 단기 차입금 비중",
      "환율·원자재 등 외부 변수의 손익 민감도",
    ],
  },
  {
    title: "추세에서 확인할 점",
    items: [
      "동종 업종 평균 대비 매출 성장 속도",
      "최근 4분기 실적의 추세 일관성",
      "주주환원(배당·자사주) 정책의 연속성",
    ],
  },
];

export default function GatedCheckpoints({ groups }: GatedCheckpointsProps) {
  const { plan, hydrated } = usePlan();
  const canSeeFull = hydrated && canAccessFeature(plan, "disclosure_summary_full");
  const canSeeAdvanced =
    hydrated && canAccessFeature(plan, "advanced_checkpoints");

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {groups.map((box) => {
          const items = canSeeFull
            ? box.items
            : box.items.slice(0, FREE_PER_GROUP);
          return (
            <div key={box.title} className="card p-5">
              <h4 className="text-sm font-semibold text-slate-900">
                {box.title}
              </h4>
              {items.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  체크포인트 데이터가 없습니다.
                </p>
              ) : (
                <ul className="mt-3 space-y-1.5">
                  {items.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {!canSeeFull && (
        <LockedFeatureCard
          requiredPlan="basic"
          title="전체 체크포인트 보기는 베이직 플랜에서 이용 가능"
          description="공시·실적·뉴스 흐름별 확인 항목을 모두 보려면 베이직 플랜으로 변경해 주세요."
        />
      )}

      {canSeeAdvanced && (
        <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-md bg-brand-700 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              PRO
            </span>
            <h4 className="text-sm font-semibold text-slate-900">
              고급 체크포인트
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ADVANCED_GROUPS.map((g) => (
              <div
                key={g.title}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <h5 className="text-sm font-semibold text-slate-900">
                  {g.title}
                </h5>
                <ul className="mt-2 space-y-1.5">
                  {g.items.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {!canSeeAdvanced && canSeeFull && (
        <LockedFeatureCard
          requiredPlan="pro"
          title="고급 체크포인트는 프로 플랜에서 이용 가능"
          description="재무 추세·외부 변수 민감도·동종 업종 비교 등 더 깊이 있는 체크포인트는 프로 플랜에서 확인할 수 있습니다."
        />
      )}
    </>
  );
}
