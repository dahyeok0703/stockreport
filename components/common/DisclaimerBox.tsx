interface DisclaimerBoxProps {
  variant?: "default" | "compact";
}

export default function DisclaimerBox({
  variant = "default",
}: DisclaimerBoxProps) {
  if (variant === "compact") {
    return (
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
        본 요약은 공시·뉴스·실적자료 등을 바탕으로 정리한 정보 제공용
        자료이며, 특정 종목의 매수·매도·보유를 권유하지 않습니다. 투자
        판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-900">
            투자 유의사항
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-900/90">
            본 요약은 공시, 뉴스, 실적자료 등을 바탕으로 정리한 정보 제공용
            자료이며, 특정 종목의 매수·매도·보유를 권유하지 않습니다. 투자
            판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
