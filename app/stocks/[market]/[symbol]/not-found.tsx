import Link from "next/link";

/**
 * 종목 동적 라우트 전용 not-found UI.
 * 잘못된 시장 코드 또는 mockStocks/매핑에 없는 심볼로 접근했을 때 표시됩니다.
 */
export default function StockNotFound() {
  return (
    <div className="container-page py-20 sm:py-24">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          종목 정보를 찾을 수 없습니다.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          검색 페이지에서 다른 종목을 찾아보세요. 한국·미국 주요 종목을 통합
          검색할 수 있습니다.
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-2 sm:flex-row">
          <Link href="/search" className="btn-primary">
            종목 검색으로 이동
          </Link>
          <Link href="/" className="btn-outline">
            홈으로 가기
          </Link>
        </div>
      </div>
    </div>
  );
}
