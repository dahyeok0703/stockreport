import { notFound } from "next/navigation";
import Link from "next/link";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import ReportSection from "@/components/stocks/ReportSection";
import DisclosureCard from "@/components/stocks/DisclosureCard";
import NewsCard from "@/components/stocks/NewsCard";
import EarningsCard from "@/components/stocks/EarningsCard";
import MetricCard from "@/components/stocks/MetricCard";
import { getStockBy, mockStocks } from "@/lib/mockStocks";

interface PageProps {
  params: { market: string; symbol: string };
}

export function generateStaticParams() {
  return (mockStocks ?? []).map((s) => ({
    market: s.market,
    symbol: s.symbol,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const stock = getStockBy(params?.market, params?.symbol);
  if (!stock) return { title: "종목을 찾을 수 없습니다 | 스톡리포트" };
  return {
    title: `${stock.name} (${stock.symbol}) 리포트 | 스톡리포트`,
    description: `${stock.name}의 공시·뉴스·실적 요약을 정보 제공용으로 정리한 리포트입니다.`,
  };
}

const tableOfContents = [
  { id: "summary", label: "A. 한눈에 보는 요약" },
  { id: "company", label: "B. 회사 개요" },
  { id: "disclosures", label: "C. 최근 공시 요약" },
  { id: "news", label: "D. 최근 뉴스 요약" },
  { id: "earnings", label: "E. 최근 실적 요약" },
  { id: "metrics", label: "F. 재무 핵심지표" },
  { id: "checkpoints", label: "G. 주요 체크포인트" },
  { id: "sources", label: "H. 원문 출처" },
];

export default function StockReportPage({ params }: PageProps) {
  const stock = getStockBy(params?.market, params?.symbol);
  if (!stock) notFound();
  const disclosures = stock.recentDisclosures ?? [];
  const news = stock.recentNews ?? [];
  const revenue = stock.revenueStructure ?? [];
  const metrics = stock.financialMetrics ?? [];
  const sourceLinks = stock.sourceLinks ?? [];
  const checkpoints = {
    disclosure: stock.checkpoints?.disclosure ?? [],
    earnings: stock.checkpoints?.earnings ?? [],
    news: stock.checkpoints?.news ?? [],
  };

  return (
    <div className="bg-slate-50/60">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page py-8 sm:py-10">
          <nav className="text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900">
              홈
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/search" className="hover:text-slate-900">
              종목검색
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-900">{stock.name}</span>
          </nav>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {stock.name}
                </h1>
                <span className="badge-outline text-sm">{stock.symbol}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="badge-brand">{stock.country}</span>
                <span className="badge-slate">{stock.exchange}</span>
                <span className="badge-slate">{stock.sector}</span>
                <span className="text-sm text-slate-600">
                  · {stock.industry}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                마지막 업데이트 · {stock.lastUpdated}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-outline text-sm"
                aria-label="관심종목에 추가"
                title="관심종목 기능은 1단계 B에서 제공될 예정입니다."
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1.5 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.365-2.446a1 1 0 00-1.176 0l-3.365 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
                  />
                </svg>
                관심종목 추가
              </button>
            </div>
          </div>

          {/* TOC */}
          <div className="mt-6 hidden flex-wrap items-center gap-2 md:flex">
            {tableOfContents.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="container-page py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
          <div className="min-w-0 space-y-12">
            {/* A. Summary */}
            <ReportSection
              id="summary"
              label="A"
              title="한눈에 보는 요약"
              description="회사의 사업 영역, 최근 정보 흐름, 투자 판단 전 확인할 항목을 정리합니다. 매수·매도 판단은 포함하지 않습니다."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    회사가 무엇을 하는지
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {stock.businessSummary}
                  </p>
                </div>
                <div className="card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    최근 정보 흐름
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {[
                      ...disclosures.slice(0, 1).map((d) => `공시: ${d.title}`),
                      ...news.slice(0, 1).map((n) => `뉴스: ${n.title}`),
                      stock.earningsSummary
                        ? `실적: ${stock.earningsSummary.period} 발표`
                        : null,
                    ]
                      .filter((v): v is string => Boolean(v))
                      .map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    투자 판단 전 확인할 항목
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {[
                      ...checkpoints.earnings.slice(0, 2),
                      ...checkpoints.news.slice(0, 1),
                    ].map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ReportSection>

            {/* B. Company Overview */}
            <ReportSection
              id="company"
              label="B"
              title="회사 개요"
              description="회사의 주요 사업, 제품/서비스, 시장, 매출 구조를 정리합니다."
            >
              <div className="card p-5">
                <p className="text-sm leading-6 text-slate-700">
                  {stock.businessSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="card p-5">
                  <h4 className="text-sm font-semibold text-slate-900">
                    주요 제품/서비스
                  </h4>
                  <ul className="mt-3 space-y-1.5">
                    {(stock.keyProducts ?? []).map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card p-5">
                  <h4 className="text-sm font-semibold text-slate-900">
                    주요 시장
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(stock.keyMarkets ?? []).map((m) => (
                      <span key={m} className="badge-slate">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h4 className="text-sm font-semibold text-slate-900">
                  매출 구조 (목업)
                </h4>
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-2 text-left">부문 / 지역</th>
                        <th className="px-4 py-2 text-right">매출 비중</th>
                        <th className="px-4 py-2 text-left">비고</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {revenue.map((r) => (
                        <tr key={r.name}>
                          <td className="px-4 py-2 font-medium text-slate-900">
                            {r.name}
                          </td>
                          <td className="px-4 py-2 text-right tabular-nums text-slate-700">
                            {r.share}
                          </td>
                          <td className="px-4 py-2 text-slate-500">
                            {r.note ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportSection>

            {/* C. Disclosures */}
            <ReportSection
              id="disclosures"
              label="C"
              title="최근 공시 요약"
              description="최근 공시의 핵심 내용을 요약하고, 원문에서 확인해야 할 항목을 정리합니다."
            >
              {disclosures.length === 0 ? (
                <div className="card p-5 text-sm text-slate-600">
                  최근 공시 데이터가 아직 준비되지 않았습니다.
                </div>
              ) : (
                disclosures.map((d) => (
                  <DisclosureCard key={d.id} disclosure={d} />
                ))
              )}
            </ReportSection>

            {/* D. News */}
            <ReportSection
              id="news"
              label="D"
              title="최근 뉴스 요약"
              description="주요 언론 보도를 요약하고, 관련 키워드를 정리합니다."
            >
              {news.length === 0 ? (
                <div className="card p-5 text-sm text-slate-600">
                  최근 뉴스 데이터가 아직 준비되지 않았습니다.
                </div>
              ) : (
                news.map((n) => <NewsCard key={n.id} news={n} />)
              )}
            </ReportSection>

            {/* E. Earnings */}
            <ReportSection
              id="earnings"
              label="E"
              title="최근 실적 요약"
              description="분기 실적의 핵심 수치와 전년 동기 대비 변화를 정리합니다. 숫자는 모두 목업 데이터입니다."
            >
              {stock.earningsSummary ? (
                <EarningsCard earnings={stock.earningsSummary} />
              ) : (
                <div className="card p-5 text-sm text-slate-600">
                  최근 실적 데이터가 아직 준비되지 않았습니다.
                </div>
              )}
            </ReportSection>

            {/* F. Financial Metrics */}
            <ReportSection
              id="metrics"
              label="F"
              title="재무 핵심지표"
              description="매출 성장률, 영업이익률, 부채 관련 지표, 현금흐름을 정리합니다. PER/PBR 등은 참고 지표로만 표시됩니다."
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {metrics.map((m) => (
                  <MetricCard key={m.label} metric={m} />
                ))}
              </div>
            </ReportSection>

            {/* G. Checkpoints */}
            <ReportSection
              id="checkpoints"
              label="G"
              title="주요 체크포인트"
              description="공시·실적·뉴스 흐름에서 확인할 항목을 정리합니다. 좋다/나쁘다 판단은 포함하지 않습니다."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  { title: "공시에서 확인할 점", items: checkpoints.disclosure },
                  { title: "실적에서 확인할 점", items: checkpoints.earnings },
                  { title: "뉴스 흐름에서 확인할 점", items: checkpoints.news },
                ].map((box) => (
                  <div key={box.title} className="card p-5">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {box.title}
                    </h4>
                    <ul className="mt-3 space-y-1.5">
                      {box.items.map((c) => (
                        <li
                          key={c}
                          className="flex items-start gap-2 text-sm text-slate-700"
                        >
                          <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ReportSection>

            {/* H. Sources */}
            <ReportSection
              id="sources"
              label="H"
              title="원문 출처"
              description="요약은 다음 자료들을 바탕으로 작성되었습니다. 자세한 내용은 원문을 직접 확인해 주세요."
            >
              <div className="card p-5">
                <ul className="divide-y divide-slate-200">
                  {sourceLinks.map((s) => (
                    <li
                      key={s.label}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="badge-outline">{s.category}</span>
                        <span className="text-sm text-slate-800">
                          {s.label}
                        </span>
                      </div>
                      <a
                        href={s.href}
                        className="text-xs font-medium text-brand-700 hover:text-brand-900 hover:underline"
                      >
                        원문 보기 →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ReportSection>

            {/* I. Disclaimer */}
            <DisclaimerBox />
          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="card p-5">
                <h4 className="text-sm font-semibold text-slate-900">
                  목차
                </h4>
                <nav className="mt-3 space-y-1.5">
                  {tableOfContents.map((t) => (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className="block rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                      {t.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="card p-5">
                <h4 className="text-sm font-semibold text-slate-900">
                  종목 정보
                </h4>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">시장</dt>
                    <dd className="text-slate-900">
                      {stock.country} · {stock.exchange}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">코드</dt>
                    <dd className="text-slate-900">{stock.symbol}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">섹터</dt>
                    <dd className="text-right text-slate-900">
                      {stock.sector}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">업종</dt>
                    <dd className="text-right text-slate-900">
                      {stock.industry}
                    </dd>
                  </div>
                </dl>
              </div>

              <DisclaimerBox variant="compact" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
