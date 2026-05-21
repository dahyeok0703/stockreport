import { Suspense } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import SearchClient from "@/components/stocks/SearchClient";

export const metadata = {
  title: "종목 검색 | 스톡리포트",
};

export const dynamic = "force-dynamic";

export default function SearchPage() {
  // 데모 모드: 인증·서버 사이드 관심종목 조회를 사용하지 않습니다.
  // 관심종목 상태는 SearchClient 내부에서 localStorage로 직접 판단합니다.
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="종목 검색"
        title="종목명·티커·업종으로 검색"
        description="한국·미국 주식을 통합 검색합니다. 검색 결과에서 리포트로 바로 이동할 수 있습니다."
      />
      <Suspense
        fallback={
          <div className="mt-8 h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        }
      >
        <SearchClient />
      </Suspense>
    </div>
  );
}
