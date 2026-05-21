"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[stockreport] route error boundary:", error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl rounded-xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          페이지 오류
        </p>
        <h1 className="mt-2 text-xl font-bold text-slate-900">
          이 페이지를 표시하는 중 문제가 발생했습니다
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          잠시 후 다시 시도해 주세요. 데이터 로딩 또는 외부 연결에서 발생한
          일시적 문제일 수 있습니다.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => reset()} className="btn-primary">
            다시 시도
          </button>
          <Link href="/" className="btn-outline">
            홈으로 가기
          </Link>
          <Link href="/search" className="btn-ghost">
            종목 검색
          </Link>
        </div>
      </div>
    </div>
  );
}
