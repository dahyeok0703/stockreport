"use client";

import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import RemoveWatchlistButton from "@/components/stocks/RemoveWatchlistButton";
import { getStockReportHref } from "@/lib/utils";
import { useLocalWatchlist } from "@/lib/watchlistLocal";

/**
 * 데모 모드 관심종목 페이지 — 브라우저 localStorage 기반.
 * Supabase 인증·서버 액션을 사용하지 않습니다. 1B의 서버 사이드 버전은
 * lib/watchlist.ts에 보존되어 있으며, 추후 인증이 켜지면 다시 사용할 수 있습니다.
 */

// 종목별 가짜 신규 카운트 — 데모용. 종목명 길이를 시드로 결정론적 값 생성.
function demoCounts(key: string): {
  newDisclosure: number;
  newNews: number;
  upcomingEarnings?: string;
} {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return {
    newDisclosure: h % 4,
    newNews: 1 + ((h >> 3) % 6),
    upcomingEarnings: h % 3 === 0 ? "다음 분기 발표 일정" : undefined,
  };
}

export default function WatchlistPage() {
  const { items, hydrated } = useLocalWatchlist();

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="관심종목"
        title="내 관심종목"
        description={
          hydrated
            ? `관심종목 ${items.length}개`
            : "관심종목을 불러오는 중…"
        }
        action={
          <Link href="/search" className="btn-outline text-sm">
            종목 추가하기
          </Link>
        }
      />

      {!hydrated ? (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h3 className="text-base font-semibold text-slate-900">
            아직 관심종목이 없습니다.
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            종목 검색에서 관심종목을 추가해보세요.
          </p>
          <div className="mt-5">
            <Link href="/search" className="btn-primary text-sm">
              종목 검색으로 이동
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* 요약 카드 */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard
              label="신규 공시"
              value={items.reduce(
                (a, b) => a + demoCounts(b.key).newDisclosure,
                0,
              )}
              suffix="건"
            />
            <SummaryCard
              label="신규 뉴스"
              value={items.reduce(
                (a, b) => a + demoCounts(b.key).newNews,
                0,
              )}
              suffix="건"
            />
            <SummaryCard
              label="다가오는 실적"
              value={
                items.filter((i) => demoCounts(i.key).upcomingEarnings).length
              }
              suffix="건"
            />
          </div>

          {/* 카드 그리드 */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((w) => {
              const c = demoCounts(w.key);
              return (
                <article
                  key={w.key}
                  className="card flex flex-col p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {w.name}
                        </h3>
                        <span className="badge-outline">{w.symbol}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="badge-brand">
                          {w.market === "kr" ? "한국" : "미국"}
                        </span>
                        {w.exchange && (
                          <span className="badge-slate">{w.exchange}</span>
                        )}
                        {w.sector && (
                          <span className="text-xs text-slate-500">
                            {w.sector}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <Mini label="신규 공시" value={c.newDisclosure} />
                    <Mini label="신규 뉴스" value={c.newNews} />
                    <Mini
                      label="실적"
                      value={c.upcomingEarnings ? "있음" : "—"}
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={getStockReportHref(w.market, w.symbol)}
                        className="btn-outline text-xs"
                      >
                        리포트 보기
                      </Link>
                      <Link
                        href={`${getStockReportHref(w.market, w.symbol)}#ai-summary`}
                        className="btn-ghost text-xs"
                      >
                        AI 정보 요약
                      </Link>
                    </div>
                    <RemoveWatchlistButton market={w.market} symbol={w.symbol} />
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-10">
        <DisclaimerBox />
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number | string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
        {suffix && (
          <span className="ml-1 text-sm font-normal text-slate-500">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md bg-slate-50 px-2 py-2">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums">
        {value}
      </p>
    </div>
  );
}
