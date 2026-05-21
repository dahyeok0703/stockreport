import type { DataStatus } from "@/lib/providers/types";

const VARIANTS: Record<
  DataStatus,
  { label: string; className: string; description: string }
> = {
  real: {
    label: "실제 데이터 기반",
    className: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    description:
      "외부 공시·재무·뉴스 API에서 수집한 데이터로 구성된 섹션입니다.",
  },
  partial: {
    label: "일부 실제 데이터 기반",
    className: "bg-brand-50 text-brand-800 border border-brand-200",
    description:
      "일부 섹션은 실제 API 데이터로, 일부는 목업 데이터로 구성되어 있습니다.",
  },
  mock: {
    label: "목업 데이터 표시 중",
    className: "bg-slate-100 text-slate-700 border border-slate-200",
    description:
      "외부 API 키가 설정되지 않아 목업 데이터로 화면이 구성되었습니다.",
  },
  error: {
    label: "데이터 로드 오류, 기존 데이터 표시 중",
    className: "bg-amber-50 text-amber-800 border border-amber-200",
    description:
      "외부 API 호출 중 오류가 발생해 캐시 또는 목업 데이터로 fallback 되었습니다.",
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
