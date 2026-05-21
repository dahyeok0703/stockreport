import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import StockCard from "@/components/stocks/StockCard";
import { mockStocks } from "@/lib/mockStocks";
import { earningsSchedule, economicSchedule } from "@/lib/mockBriefing";
import { PLAN_LIMITS } from "@/lib/planLimits";
import { getStockReportHref } from "@/lib/utils";

const featureCards = [
  {
    title: "공시 요약",
    description:
      "DART·SEC EDGAR 공시의 핵심을 정리하고, 직접 확인해야 할 항목을 함께 보여줍니다.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-7 5h8a2 2 0 002-2V7l-5-5H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "뉴스 흐름 정리",
    description:
      "주요 언론사 보도를 모아 최근 정보 흐름을 정리하고, 관련 키워드를 함께 표시합니다.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2zM7 8h6m-6 4h10m-10 4h7" />
      </svg>
    ),
  },
  {
    title: "실적 정보 정리",
    description:
      "분기·연간 실적을 매출·영업이익·순이익 중심으로 정리하고 확인할 체크포인트를 보여줍니다.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 15l4-4 4 4 6-6" />
      </svg>
    ),
  },
  {
    title: "관심종목 브리핑",
    description:
      "내가 추가한 종목의 신규 공시·뉴스·실적 일정을 한 곳에서 빠르게 훑어볼 수 있습니다.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.365-2.446a1 1 0 00-1.176 0l-3.365 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
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
    title: "중립적 정보",
    body: "매수·매도·목표가 같은 판단성 표현을 배제하고, 확인할 항목과 변화 흐름을 제공합니다.",
  },
];

const QUICK_KR = [
  { name: "삼성전자", symbol: "005930" },
  { name: "SK하이닉스", symbol: "000660" },
  { name: "NAVER", symbol: "035420" },
  { name: "카카오", symbol: "035720" },
  { name: "현대차", symbol: "005380" },
  { name: "LG에너지솔루션", symbol: "373220" },
];

const QUICK_US = [
  { name: "Apple", symbol: "AAPL" },
  { name: "Microsoft", symbol: "MSFT" },
  { name: "Nvidia", symbol: "NVDA" },
  { name: "Tesla", symbol: "TSLA" },
  { name: "Meta", symbol: "META" },
  { name: "AMD", symbol: "AMD" },
];

export default function HomePage() {
  const popular = (mockStocks ?? []).slice(0, 4);
  const briefingPreview = [...earningsSchedule, ...economicSchedule]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, 5);
  const plans = Object.values(PLAN_LIMITS);

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
              <span className="text-brand-700"> 한눈에 정리합니다.</span>
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              한국과 미국 주식의 공시, 뉴스, 실적 정보를 모아 핵심만 정리합니다.
              매수·매도 권유 없이, 투자자가 직접 판단할 수 있는 정보를 제공합니다.
            </p>

            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar size="lg" />
              <p className="mt-3 text-xs text-slate-500">
                예시: 삼성전자, NAVER, Tesla, NVDA
              </p>
            </div>

            {/* Quick links */}
            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
              <QuickGroup title="한국 주요 종목" market="kr" items={QUICK_KR} />
              <QuickGroup title="미국 주요 종목" market="us" items={QUICK_US} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS — 4 cards */}
      <section className="container-page py-16">
        <SectionTitle
          eyebrow="핵심 기능"
          title="필요한 정보만 빠르게 확인하세요"
          description="공시, 뉴스, 실적, 관심종목 — 흩어져 있는 정보를 한곳으로 모아 정리합니다."
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          eyebrow="많이 조회된 종목"
          title="자주 확인된 종목 리포트"
          description="이 목록은 추천이 아니며, 사용자들이 자주 조회한 종목을 정리한 것입니다."
          action={
            <Link href="/search" className="btn-outline text-sm">
              전체 종목 보기
            </Link>
          }
        />
        {popular.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-600">
            표시할 종목 데이터가 아직 준비되지 않았습니다.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((stock) => (
              <StockCard
                key={`${stock.market}-${stock.symbol}`}
                stock={stock}
              />
            ))}
          </div>
        )}
      </section>

      {/* BRIEFING PREVIEW */}
      <section className="border-y border-slate-200 bg-white">
        <div className="container-page py-16">
          <SectionTitle
            eyebrow="오늘의 브리핑 미리보기"
            title="확인할 일정"
            description="이번 주~다음 주 주요 실적 발표·경제지표 일정입니다."
            action={
              <Link href="/calendar" className="btn-outline text-sm">
                캘린더 전체 보기
              </Link>
            }
          />
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            <ul className="divide-y divide-slate-200">
              {briefingPreview.map((it) => (
                <li
                  key={it.id}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge-brand">{it.type}</span>
                    <span className="badge-slate">{it.region}</span>
                    <span className="text-sm font-medium text-slate-900">
                      {it.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{it.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="container-page py-16">
        <SectionTitle
          eyebrow="요금제"
          title="필요한 만큼 선택"
          description="무료부터 시작해 사용량에 맞는 요금제를 선택할 수 있습니다."
          action={
            <Link href="/pricing" className="btn-outline text-sm">
              요금제 자세히 보기
            </Link>
          }
        />
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.code} className="card flex flex-col p-6">
              <h3 className="text-base font-semibold text-slate-900">
                {p.label}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                하루 리포트 {p.dailyReportViews}회 · AI 요약 {p.dailyAiSummaries}회 ·
                관심종목 {p.watchlistLimit}개
              </p>
              <Link
                href="/pricing"
                className="mt-4 text-xs font-medium text-brand-700 hover:underline"
              >
                자세히 보기 →
              </Link>
            </div>
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

function QuickGroup({
  title,
  market,
  items,
}: {
  title: string;
  market: "kr" | "us";
  items: { name: string; symbol: string }[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-card sm:max-w-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((s) => (
          <Link
            key={s.symbol}
            href={getStockReportHref(market, s.symbol)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-800 hover:border-brand-200"
          >
            {s.name}
            <span className="text-[10px] text-slate-500">{s.symbol}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
