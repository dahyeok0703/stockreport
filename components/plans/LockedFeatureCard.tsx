"use client";

import Link from "next/link";
import { planLabel } from "@/lib/plans/featureAccess";
import type { UserPlan } from "@/lib/plans/types";

interface LockedFeatureCardProps {
  /** 필요한 플랜 */
  requiredPlan: UserPlan;
  /** 카드 상단 핵심 문구. 미지정 시 표준 문구를 자동 생성 */
  title?: string;
  /** 보조 설명 */
  description?: string;
  /** 컴팩트 인라인 형태 — 본문 사이에 끼울 때 */
  variant?: "default" | "inline";
}

export default function LockedFeatureCard({
  requiredPlan,
  title,
  description,
  variant = "default",
}: LockedFeatureCardProps) {
  const planText = planLabel(requiredPlan);
  const heading = title ?? `${planText} 플랜에서 이용 가능`;
  const subtitle =
    description ?? "요금제를 변경하면 전체 정보를 확인할 수 있습니다.";

  if (variant === "inline") {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-dashed border-brand-200 bg-brand-50/60 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <LockIcon className="h-4 w-4 text-brand-700" />
          <span className="text-brand-900">{heading}</span>
        </div>
        <Link
          href="/pricing"
          className="self-start text-xs font-medium text-brand-700 hover:underline sm:self-auto"
        >
          요금제 보기 →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <LockIcon className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-brand-900">{heading}</p>
          <p className="mt-1 text-sm leading-6 text-brand-900/85">{subtitle}</p>
          <div className="mt-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 rounded-md bg-brand-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-800"
            >
              요금제 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V8a4 4 0 10-8 0v3M5 11h14v10H5V11z"
      />
    </svg>
  );
}
