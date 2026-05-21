import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import StockCard from "@/components/stocks/StockCard";
import { mockStocks } from "@/lib/mockStocks";

const featureCards = [
  {
    title: "공시 요약",
    description:
      "DART, SEC EDGAR 등 공시 원문의 핵심을 정리하고, 직접 확인해야 할 항목을 함께 보여줍니다.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-7 5h8a2 2 0 002-2V7l-5-5H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "뉴스 요약",
    description:
      "주요 언론사의 종목 관련 보도를 모아 핵심을 요약하고, 관련 키워드를 함께 정리합니다.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2zM7 8h6m-6 4h10m-10 4h7" />
      </svg>
    ),
  },
  {
    title: "실적 요약",
    description:
      "분기·연간 실적을 매출, 영업이익, 순이익 중심으로 정리하고 확인할 체크포인트를 보여줍니다.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 15l4-4 4 4 6-6" />
      </svg>
    ),
  },
];

const valueProps = [
  {
    title: "정보 정리 중심",
    body: "추천 대신 정리합니다. 공시·뉴스·실적의 핵심을 중립적으로 보여줍니다.",
  },
  {
    title: "원문 기반",
    body: "모든 요약은 공시·뉴스·실적자료 등 원문을 기반으로 합니다. 원문 링크를 함께 제공합니다.",
  },
  {
    title: "한국·미국 주식 지원",
    body: "DART(한국)와 SEC EDGAR(미국)를 함께 확인할 수 있는 통합형 정보 구조를 지향합니다.",
  },
  {
    title: "중립적 요약",
    body: "매수·매도·목표가 같은 판단성 표현을 배제하고, 확인할 항목과 변화 흐름을 제공합니다.",
  },
];

export default function HomePage() {
  const popular = mockStocks.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-600" />
              한국·미국 주식 정보 요약 서비스
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              주식 공시·뉴스·실적,<br className="hidden sm:inline" />
              <span className="text-brand-700"> AI가 한눈에 정리합니다.</span>
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              한국과 미국 주식의 공시, 뉴스, 실적 정보를 모아 핵심만 요약합니다.
              매수·매도 권유 없이, 투자자가 직접 판단할 수 있는 정보를 제공합니다.
            </p>

            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar size="lg" />
              <p className="mt-3 text-xs text-slate-500">
                예시: 삼성전자, NAVER, Tesla, NVDA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="container-page py-16">
        <SectionTitle
          eyebrow="핵심 기능"
          title="필요한 정보만 빠르게 확인하세요"
          description="공시, 뉴스, 실적 — 흩어져 있는 정보를 종목 하나로 모아 정리합니다."
        />
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {featureCards.map((f) => (
            <div key={f.title} className="card flex flex-col p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                {f.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="container-page py-16">
          <SectionTitle
            eyebrow="왜 스톡리포트인가"
            title="추천 대신 정리, 판단은 본인의 몫"
            description="투자 판단은 사용자에게 맡기고, 우리는 그 판단의 재료를 정리합니다."
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {valueProps.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section className="container-page py-16">
        <SectionTitle
          eyebrow="최근 많이 조회된 종목"
          title="자주 확인된 종목 리포트"
          description="이 목록은 추천이 아니며, 사용자들이 자주 조회한 종목을 정리한 것입니다."
          action={
            <Link href="/search" className="btn-outline text-sm">
              전체 종목 보기
            </Link>
          }
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((stock) => (
            <StockCard key={`${stock.market}-${stock.symbol}`} stock={stock} />
          ))}
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="container-page pb-16">
        <DisclaimerBox />
      </section>
    </div>
  );
}
