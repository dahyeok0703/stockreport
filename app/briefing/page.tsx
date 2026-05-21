import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import {
  earningsSchedule,
  economicSchedule,
  koreaBriefing,
  mainDisclosures,
  mainNews,
  topViewedStocks,
  usBriefing,
  type MarketBriefing,
} from "@/lib/mockBriefing";
import { getStockReportHref } from "@/lib/utils";
import { getRuntimeFlags } from "@/lib/config/env";

export const dynamic = "force-dynamic";

function MarketBriefingCard({ briefing }: { briefing: MarketBriefing }) {
  return (
    <article className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          오늘의 {briefing.market} 시장
        </h3>
        <span className="badge-brand">{briefing.market}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-700">
        {briefing.headline}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {briefing.summary}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {(briefing.indices ?? []).map((i) => (
          <div
            key={i.name}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <p className="text-xs text-slate-500">{i.name}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {i.value}
            </p>
            <p
              className={`mt-0.5 text-xs font-medium ${
                i.change.startsWith("-") ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {i.change}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          주요 정보 흐름
        </p>
        <ul className="mt-2 space-y-1.5">
          {(briefing.topMoves ?? []).map((m) => (
            <li
              key={m}
              className="flex items-start gap-2 text-sm text-slate-700"
            >
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function BriefingPage() {
  const flags = getRuntimeFlags();
  const someRealData =
    flags.dart || flags.sec || flags.newsProvider !== "mock";

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="오늘의 브리핑"
        title="시장과 종목의 주요 정보 흐름"
        description="한국·미국 시장 흐름, 주요 뉴스, 주요 공시, 발표 일정을 한 페이지에서 확인합니다."
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {someRealData ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            일부 데이터 연동 준비됨 (
            {[
              flags.dart ? "DART" : null,
              flags.sec ? "SEC" : null,
              flags.newsProvider !== "mock" ? `news:${flags.newsProvider}` : null,
            ]
              .filter(Boolean)
              .join(", ")}
            )
          </span>
        ) : (
          <span className="badge-slate">목업 데이터 표시 중</span>
        )}
        <span className="badge-slate">브리핑 자동 생성은 2단계 A에서 구현 예정</span>
      </div>

      {/* MARKET CARDS */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <MarketBriefingCard briefing={koreaBriefing} />
        <MarketBriefingCard briefing={usBriefing} />
      </div>

      {/* NEWS + DISCLOSURES */}
      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900">주요 뉴스 요약</h3>
          <p className="mt-1 text-xs text-slate-500">
            언론사 보도 중 시장에서 자주 언급된 주제를 정리합니다.
          </p>
          <ul className="mt-4 divide-y divide-slate-200">
            {(mainNews ?? []).map((n) => (
              <li key={n.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2">
                  {n.tag && <span className="badge-slate">{n.tag}</span>}
                  {n.time && (
                    <span className="text-xs text-slate-500">{n.time}</span>
                  )}
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {n.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {n.summary}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900">주요 공시 요약</h3>
          <p className="mt-1 text-xs text-slate-500">
            한국 DART·미국 SEC 등의 주요 공시 요약입니다.
          </p>
          <ul className="mt-4 divide-y divide-slate-200">
            {(mainDisclosures ?? []).map((d) => (
              <li key={d.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2">
                  {d.tag && <span className="badge-brand">{d.tag}</span>}
                  {d.time && (
                    <span className="text-xs text-slate-500">{d.time}</span>
                  )}
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {d.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {d.summary}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SCHEDULES */}
      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900">
            주요 실적 발표 일정
          </h3>
          <ul className="mt-4 divide-y divide-slate-200">
            {(earningsSchedule ?? []).map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {s.title}
                  </p>
                  <p className="text-xs text-slate-500">{s.date}</p>
                </div>
                <span className="badge-slate">{s.region}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900">
            주요 경제지표 일정
          </h3>
          <ul className="mt-4 divide-y divide-slate-200">
            {(economicSchedule ?? []).map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {s.title}
                  </p>
                  <p className="text-xs text-slate-500">{s.date}</p>
                </div>
                <span className="badge-slate">{s.region}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* TOP VIEWED */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-slate-900">
          오늘 많이 조회된 종목
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          이 목록은 추천이 아니며, 사용자들이 자주 확인한 종목을 정리한 것입니다.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(topViewedStocks ?? []).map((t) => (
            <Link
              key={`${t.market}-${t.symbol}`}
              href={getStockReportHref(t.market, t.symbol)}
              className="card flex flex-col p-5 transition hover:shadow-cardHover"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">
                  {t.name}
                </span>
                <span className="badge-outline">{t.symbol}</span>
              </div>
              <span className="mt-1 text-xs text-slate-500">{t.exchange}</span>
              <p className="mt-3 text-sm text-slate-600">{t.reason}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <DisclaimerBox />
      </div>
    </div>
  );
}
