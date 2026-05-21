interface DemoModeNoticeProps {
  variant?: "default" | "report";
}

/**
 * 데모 모드 안내 박스. 종목 리포트 등 정보 페이지 상단에 표시합니다.
 * 실제 외부 API 연동이 추가되면 표시 조건만 분기하면 됩니다.
 */
export default function DemoModeNotice({
  variant = "default",
}: DemoModeNoticeProps) {
  if (variant === "report") {
    return (
      <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-xs leading-5 text-brand-900 sm:text-sm">
        <p className="font-semibold">데모 모드 안내</p>
        <p className="mt-0.5">
          현재 이 리포트는 데모 데이터 기반으로 표시됩니다. 실제 공시·뉴스·실적
          연동은 이후 단계에서 제공될 예정입니다.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
      현재 데모 데이터로 표시 중입니다. 실제 API 연동은 이후 단계에서 제공될
      예정입니다.
    </div>
  );
}
