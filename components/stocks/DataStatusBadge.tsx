import type { DataStatus } from "@/lib/providers/types";

/**
 * 데이터 출처 표시 배지.
 * 외부 API 연결 상태에 따라 라벨이 달라지지만, 사용자에게는 자연스러운
 * "데이터 제공 상태" 표현만 보입니다.
 */

const VARIANTS: Record<
  DataStatus,
  { label: string; className: string; description: string }
> = {
  real: {
    label: "외부 데이터 연동",
    className: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    description: "외부 공시·재무·뉴스 데이터로 구성된 섹션입니다.",
  },
  partial: {
    label: "일부 외부 연동",
    className: "bg-brand-50 text-brand-800 border border-brand-200",
    description: "일부 섹션은 외부 데이터, 일부는 내부 정리 데이터로 구성됩니다.",
  },
  mock: {
    label: "정보 제공용 자료",
    className: "bg-slate-100 text-slate-700 border border-slate-200",
    description:
      "정리된 정보 제공용 자료입니다. 원문은 출처 링크에서 확인할 수 있습니다.",
  },
  error: {
    label: "데이터 제공 상태",
    className: "bg-amber-50 text-amber-800 border border-amber-200",
    description: "데이터 제공 상태를 확인 중입니다.",
  },
};

interface DataStatusBadgeProps {
  status: DataStatus;
  showDescription?: boolean;
  size?: "sm" | "md";
}

export default function DataStatusBadge({
  status,
  showDescription = false,
  size = "sm",
}: DataStatusBadgeProps) {
  const v = VARIANTS[status];
  const sizing =
    size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <span className="inline-flex flex-col">
      <span
        className={`inline-flex items-center gap-1.5 rounded-md font-medium ${sizing} ${v.className}`}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        {v.label}
      </span>
      {showDescription && (
        <span className="mt-1 text-xs text-slate-500">{v.description}</span>
      )}
    </span>
  );
}
