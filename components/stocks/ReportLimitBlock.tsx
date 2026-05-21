import Link from "next/link";
import DisclaimerBox from "@/components/common/DisclaimerBox";

interface ReportLimitBlockProps {
  used: number;
  limit: number;
}

export default function ReportLimitBlock({
  used,
  limit,
}: ReportLimitBlockProps) {
  return (
    <div>
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-bold text-amber-900">
          오늘의 종목 리포트 조회 한도를 모두 사용했습니다.
        </h2>
        <p className="mt-2 text-sm leading-6 text-amber-900/90">
          오늘 사용량 {used} / {limit}회. 한도는 매일 초기화됩니다. 더 많은
          리포트가 필요하면 요금제를 확인해 주세요.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link href="/pricing" className="btn-primary text-sm">
            요금제 보기
          </Link>
          <Link href="/watchlist" className="btn-outline text-sm">
            관심종목으로 가기
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-2xl">
        <DisclaimerBox />
      </div>
    </div>
  );
}
