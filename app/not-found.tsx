import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20 sm:py-24">
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          주소가 변경되었거나 더 이상 존재하지 않는 페이지입니다.
          검색 페이지에서 다른 종목을 찾아보세요.
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
