import { notFound } from "next/navigation";
import Link from "next/link";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import DemoModeNotice from "@/components/common/DemoModeNotice";
import ReportSection from "@/components/stocks/ReportSection";
import WatchlistButton from "@/components/stocks/WatchlistButton";
import ReportLimitBlock from "@/components/stocks/ReportLimitBlock";
import ReportViewTracker from "@/components/stocks/ReportViewTracker";
import DataStatusBadge from "@/components/stocks/DataStatusBadge";
import FilingCard from "@/components/stocks/FilingCard";
import NormalizedNewsCard from "@/components/stocks/NormalizedNewsCard";
import FinancialTable from "@/components/stocks/FinancialTable";
import EarningsBox from "@/components/stocks/EarningsBox";
import PriceSnapshotBox from "@/components/stocks/PriceSnapshotBox";
import { getStockReport } from "@/lib/data/stockDataService";
import { getStockBy } from "@/lib/mockStocks";
import { getDemoPriceSnapshot } from "@/lib/priceSnapshot";
import { getRuntimeFlags } from "@/lib/config/env";
import { isAiCallable } from "@/lib/ai/config";
import AiSummarySection from "@/components/stocks/AiSummarySection";
import type { StockMarket } from "@/lib/providers/types";

interface PageProps {
  params: { market: string; symbol: string };
}

export const dynamic = "force-dynamic";

function isMarket(v: string): v is StockMarket {
  return v === "kr" || v === "us";
}

export async function generateMetadata({ params }: PageProps) {
  if (!isMarket(params.market)) {
    return {
      title: "종목을 찾을 수 없습니다 | 스톡리포트",
      robots: { index: false, follow: false },
    };
  }
  const fallback = getStockBy(params.market, params.symbol);
  const name = fallback?.name ?? params.symbol;
  return {
    title: `${name} 공시·뉴스·실적 요약 | 스톡리포트`,
    description: `${name}의 공시, 뉴스, 실적, 재무 정보를 한 페이지에서 정리한 정보 제공용 리포트입니다.`,
    robots: { index: false, follow: false },
  };
}

const tableOfContents = [
  { id: "price", label: "B. 가격 정보" },
  { id: "summary", label: "C. 한눈에 보는 정보" },
  { id: "company", label: "D. 회사 개요" },
  { id: "filings", label: "E. 최근 공시/제출자료" },
  { id: "news", label: "F. 최근 뉴스 흐름" },
  { id: "earnings", label: "G. 실적 정보" },
  { id: "financials", label: "H. 재무 핵심지표" },
  { id: "checkpoints", label: "I. 주요 체크포인트" },
  { id: "ai-summary", label: "J. 데모 AI 정보 요약" },
  { id: "sources", label: "K. 원문 출처" },
];

export default async function StockReportPage({ params }: PageProps) {
  if (!isMarket(params.market)) notFound();

  const report = await getStockReport(params.market, params.symbol);
  if (!report) notFound();

  // 데모 모드: 로그인·사용량 추적·서버 사이드 관심종목 조회를 사용하지 않습니다.
  // 관심종목 상태는 클라이언트 컴포넌트(WatchlistButton)가 localStorage에서 직접 읽습니다.
  const isLoggedIn = false;
  const limitExceeded = false;
  const flags = getRuntimeFlags();
  const aiEnabled = isAiCallable();

  // 회사 개요 fallback (mockStocks의 keyProducts·keyMarkets·revenueStructure 사용)
  const mockMeta = getStockBy(report.stock.market, report.stock.symbol);
  const keyProducts = mockMeta?.keyProducts ?? [];
  const keyMarkets = mockMeta?.keyMarkets ?? [];
  const revenueStructure = mockMeta?.revenueStructure ?? [];
  const checkpoints = {
    disclosure: mockMeta?.checkpoints?.disclosure ?? [],
    earnings: mockMeta?.checkpoints?.earnings ?? [],
    news: mockMeta?.checkpoints?.news ?? [],
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
            <span className="text-slate-900">{report.stock.name}</span>
          </nav>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {report.stock.name}
                </h1>
                <span className="badge-outline text-sm">
                  {report.stock.symbol}
                </span>
                <DataStatusBadge status={report.dataStatus} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="badge-brand">{report.stock.country}</span>
                {report.stock.exchange && (
                  <span className="badge-slate">{report.stock.exchange}</span>
                )}
                {report.stock.sector && (
                  <span className="badge-slate">{report.stock.sector}</span>
                )}
                {report.stock.industry && (
                  <span className="text-sm text-slate-600">
                    · {report.stock.industry}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                마지막 업데이트 ·{" "}
                {new Date(report.lastUpdated).toLocaleString("ko-KR")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <WatchlistButton
                market={report.stock.market}
                symbol={report.stock.symbol}
                name={report.stock.name}
                exchange={report.stock.exchange}
                sector={report.stock.sector}
              />
            </div>
          </div>

          {report.warnings.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {report.warnings.map((w, i) => (
                <div
                  key={i}
                  className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
                >
                  {w}
                </div>
              ))}
            </div>
          )}

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
      {limitExceeded ? (
        <div className="container-page py-10">
          <ReportLimitBlock limit={3} used={3} />
        </div>
      ) : (
        <div className="container-page py-10">
          {isLoggedIn && (
            <ReportViewTracker
              market={report.stock.market}
              symbol={report.stock.symbol}
            />
          )}
          <div className="mb-6">
            <DemoModeNotice variant="report" />
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
            <div className="min-w-0 space-y-12">
              {/* B. 가격 정보 — 데모 가격 데이터 */}
              <section id="price" className="scroll-mt-24">
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md bg-brand-700 px-2 text-xs font-bold uppercase text-white">
                    B
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    가격 정보
                  </h2>
                </div>
                <PriceSnapshotBox
                  snap={getDemoPriceSnapshot(
                    getStockBy(report.stock.market, report.stock.symbol) ?? {
                      market: report.stock.market,
                      symbol: report.stock.symbol,
                    } as never,
                  )}
                />
              </section>

              {/* C. 데이터 기반 요약 — AI 요약 아님 */}
              <ReportSection
                id="summary"
                label="C"
                title="한눈에 보는 정보"
                description="회사 개요와 최근 정보 흐름, 확인할 항목을 데이터 기반으로 정리합니다."
              >
                <div className="card p-6">
                  <p className="text-sm leading-7 text-slate-700">
                    {report.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-500">섹션 데이터 상태:</span>
                    <DataStatusBadge status={report.sectionStatus.overview} />
                  </div>
                </div>
              </ReportSection>

              {/* D. 회사 개요 */}
              <ReportSection
                id="company"
                label="D"
                title="회사 개요"
                description="회사의 주요 사업·제품/서비스·시장·매출 구조를 정리합니다."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="card p-5">
                    <h4 className="text-sm font-semibold text-slate-900">
                      주요 제품/서비스
                    </h4>
                    {keyProducts.length === 0 ? (
                      <p className="mt-2 text-sm text-slate-500">
                        현재 제공 가능한 제품/서비스 데이터가 없습니다.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-1.5">
                        {keyProducts.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-2 text-sm text-slate-700"
                          >
                            <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="card p-5">
                    <h4 className="text-sm font-semibold text-slate-900">
                      주요 시장
                    </h4>
                    {keyMarkets.length === 0 ? (
                      <p className="mt-2 text-sm text-slate-500">
                        현재 제공 가능한 시장 데이터가 없습니다.
                      </p>
                    ) : (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {keyMarkets.map((m) => (
                          <span key={m} className="badge-slate">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {revenueStructure.length > 0 && (
                  <div className="card p-5">
                    <h4 className="text-sm font-semibold text-slate-900">
                      매출 구조 (참고)
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
                          {revenueStructure.map((r) => (
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
                )}
              </ReportSection>

              {/* E. 공시 / Filings */}
              <ReportSection
                id="filings"
                label="E"
                title={
                  report.stock.market === "kr"
                    ? "최근 공시 (OpenDART 형식)"
                    : "최근 제출자료 (SEC EDGAR 형식)"
                }
                description="회사가 공식적으로 제출한 자료의 목록입니다. 제목·일자·유형·원문 링크를 그대로 표시합니다."
              >
                <div className="flex flex-wrap items-center gap-2">
                  <DataStatusBadge status={report.sectionStatus.filings} />
                </div>
                {report.filings.length === 0 ? (
                  <div className="card p-5 text-sm text-slate-600">
                    현재 제공 가능한 공시 데이터가 없습니다.
                  </div>
                ) : (
                  report.filings.map((f) => <FilingCard key={f.id} filing={f} />)
                )}
              </ReportSection>

              {/* F. 뉴스 */}
              <ReportSection
                id="news"
                label="F"
                title="최근 뉴스 흐름"
                description="여러 출처의 종목 관련 뉴스를 모아 제목·출처·날짜·키워드 중심으로 정리합니다."
              >
                <div className="flex flex-wrap items-center gap-2">
                  <DataStatusBadge status={report.sectionStatus.news} />
                  <span className="text-xs text-slate-500">
                    공급자: <code className="text-slate-700">{flags.newsProvider}</code>
                  </span>
                </div>
                {report.news.length === 0 ? (
                  <div className="card p-5 text-sm text-slate-600">
                    현재 제공 가능한 뉴스 데이터가 없습니다.
                  </div>
                ) : (
                  report.news.map((n) => (
                    <NormalizedNewsCard key={n.id} news={n} />
                  ))
                )}
              </ReportSection>

              {/* G. 실적 정보 */}
              <ReportSection
                id="earnings"
                label="G"
                title="실적 정보"
                description="최근 보고 기간의 매출·영업이익·순이익을 정리합니다. 숫자는 입력 데이터에 있는 경우에만 사용됩니다."
              >
                <div className="flex flex-wrap items-center gap-2">
                  <DataStatusBadge status={report.sectionStatus.financials} />
                  <span className="text-xs text-slate-500">
                    데이터 기준 안내 — 표시되는 수치는 데모 데이터입니다.
                  </span>
                </div>
                {report.earnings ? (
                  <EarningsBox earnings={report.earnings} />
                ) : (
                  <div className="card p-5 text-sm text-slate-600">
                    현재 제공 가능한 실적 데이터가 없습니다.
                  </div>
                )}
              </ReportSection>

              {/* H. 재무 핵심지표 */}
              <ReportSection
                id="financials"
                label="H"
                title="재무 핵심지표"
                description="매출 성장률·영업이익률·부채·현금흐름을 정리합니다. PER/PBR 등은 참고 지표로만 표시되며 투자 판단은 포함하지 않습니다."
              >
                <div className="flex flex-wrap items-center gap-2">
                  <DataStatusBadge status={report.sectionStatus.financials} />
                </div>
                {report.financials.length === 0 ? (
                  <div className="card p-5 text-sm text-slate-600">
                    현재 제공 가능한 재무 데이터가 없습니다.
                  </div>
                ) : (
                  <FinancialTable metrics={report.financials} />
                )}
              </ReportSection>

              {/* I. 체크포인트 */}
              <ReportSection
                id="checkpoints"
                label="I"
                title="주요 체크포인트"
                description="공시·실적·뉴스·재무 흐름에서 확인할 수 있는 항목입니다. 좋다/나쁘다 판단은 포함하지 않습니다."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[
                    {
                      title: "공시에서 확인할 점",
                      items: checkpoints.disclosure,
                    },
                    {
                      title: "실적에서 확인할 점",
                      items: checkpoints.earnings,
                    },
                    {
                      title: "뉴스 흐름에서 확인할 점",
                      items: checkpoints.news,
                    },
                  ].map((box) => (
                    <div key={box.title} className="card p-5">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {box.title}
                      </h4>
                      {box.items.length === 0 ? (
                        <p className="mt-2 text-sm text-slate-500">
                          체크포인트 데이터가 없습니다.
                        </p>
                      ) : (
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
                      )}
                    </div>
                  ))}
                </div>
              </ReportSection>

              {/* J. 데모 AI 정보 요약 */}
              <section id="ai-summary" className="scroll-mt-24">
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md bg-brand-700 px-2 text-xs font-bold uppercase text-white">
                    J
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    데모 AI 정보 요약
                  </h2>
                </div>
                <p className="mb-3 text-sm leading-6 text-slate-600">
                  AI 정보 요약 기능은 정식 연동 단계에서 제공될 예정입니다.
                  현재 표시되는 내용은 입력 데이터에서 생성한 데모 요약이며,
                  투자 판단을 포함하지 않습니다.
                </p>
                <AiSummarySection
                  market={report.stock.market}
                  symbol={report.stock.symbol}
                  isLoggedIn={isLoggedIn}
                  aiEnabled={aiEnabled}
                />
              </section>

              {/* K. 원문 출처 */}
              <ReportSection
                id="sources"
                label="K"
                title="원문 출처"
                description="표시된 정보는 다음 데모 데이터와 원문 링크 자리표시를 기반으로 구성됩니다. 정식 출시 단계에서는 OpenDART·SEC EDGAR·뉴스 공급자 원문이 직접 연결됩니다."
              >
                <div className="card p-5">
                  <ul className="divide-y divide-slate-200">
                    {report.sourceLinks.map((s) => (
                      <li
                        key={s.label + s.href}
                        className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="badge-outline">{s.category}</span>
                          <span className="text-sm text-slate-800">
                            {s.label}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({s.provider})
                          </span>
                        </div>
                        {s.href && s.href !== "#" ? (
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-brand-700 hover:text-brand-900 hover:underline"
                          >
                            원문 보기 →
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">
                            현재 직접 링크 없음
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
                  <p className="font-semibold text-slate-700">데이터 출처</p>
                  <ul className="mt-1 space-y-0.5">
                    <li>· 한국 공시: OpenDART (opendart.fss.or.kr)</li>
                    <li>· 미국 공시: SEC EDGAR (data.sec.gov)</li>
                    <li>· 뉴스: 설정된 뉴스 공급자 ({flags.newsProvider})</li>
                    <li>· 재무: OpenDART 단일회사 주요계정 / SEC XBRL companyfacts</li>
                  </ul>
                  <p className="mt-2">
                    표시된 정보는 API 응답과 원문 링크를 기반으로 구성됩니다.
                  </p>
                </div>
              </ReportSection>

              <DisclaimerBox />
            </div>

            {/* SIDEBAR */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                <div className="card p-5">
                  <h4 className="text-sm font-semibold text-slate-900">목차</h4>
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
                    데이터 상태
                  </h4>
                  <div className="mt-3 space-y-2 text-sm">
                    <Row label="공시" status={report.sectionStatus.filings} />
                    <Row label="재무" status={report.sectionStatus.financials} />
                    <Row label="뉴스" status={report.sectionStatus.news} />
                    <Row
                      label="회사 개요"
                      status={report.sectionStatus.overview}
                    />
                  </div>
                </div>

                <DisclaimerBox variant="compact" />
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  status,
}: {
  label: string;
  status: import("@/lib/providers/types").DataStatus;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-600">{label}</span>
      <DataStatusBadge status={status} />
    </div>
  );
}
