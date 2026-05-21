import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        주소가 변경되었거나 더 이상 존재하지 않는 페이지입니다.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2">
        <Link href="/" className="btn-primary">
          홈으로 가기
        </Link>
        <Link href="/search" className="btn-outline">
          종목 검색
        </Link>
      </div>
    </div>
  );
}
