"use client";

/**
 * 종목 비교 페이지.
 *
 * 최대 4개 종목을 골라 핵심 지표를 한 화면에서 비교합니다.
 * URL `?symbols=kr:005930,us:NVDA` 형식을 통해 공유 가능.
 */

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import { getStockBy, mockStocks, type Stock } from "@/lib/mockStocks";
import {
  formatDemoChange,
  formatDemoPrice,
  formatDemoVolume,
  getDemoPriceSnapshot,
} from "@/lib/priceSnapshot";
import { getStockReportHref } from "@/lib/utils";

const MAX_SLOTS = 4;

interface StockKey {
  market: "kr" | "us";
  symbol: string;
}

function parseSymbolsParam(raw: string | null): StockKey[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      const [market, symbol] = token.split(":");
      if ((market === "kr" || market === "us") && symbol) {
        return { market, symbol } as StockKey;
      }
      return null;
    })
    .filter((x): x is StockKey => Boolean(x))
    .filter(
      (x, i, arr) =>
        arr.findIndex(
          (y) =>
            y.market === x.market &&
            y.symbol.toLowerCase() === x.symbol.toLowerCase(),
        ) === i,
    )
    .slice(0, MAX_SLOTS);
}

function serializeKeys(keys: StockKey[]): string {
  return keys.map((k) => `${k.market}:${k.symbol}`).join(",");
}

function CompareInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKeys = useMemo(
    () => parseSymbolsParam(searchParams?.get("symbols") ?? null),
    [searchParams],
  );

  const [keys, setKeys] = useState<StockKey[]>(initialKeys);

  // URL 동기화
  useEffect(() => {
    const next = serializeKeys(keys);
    const current = searchParams?.get("symbols") ?? "";
    if (next === current) return;
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (next) params.set("symbols", next);
    else params.delete("symbols");
    router.replace(`/compare${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }, [keys, router, searchParams]);

  const stocks = useMemo(
    () =>
      keys
        .map((k) => getStockBy(k.market, k.symbol))
        .filter((s): s is Stock => Boolean(s)),
    [keys],
  );

  const add = useCallback((stock: Stock) => {
    setKeys((prev) => {
      const k = { market: stock.market, symbol: stock.symbol };
      if (
        prev.some(
          (p) =>
            p.market === k.market &&
            p.symbol.toLowerCase() === k.symbol.toLowerCase(),
        )
      ) {
        return prev;
      }
      if (prev.length >= MAX_SLOTS) return prev;
      return [...prev, k];
    });
  }, []);

  const remove = useCallback((market: string, symbol: string) => {
    setKeys((prev) =>
      prev.filter(
        (p) =>
          !(
            p.market === market &&
            p.symbol.toLowerCase() === symbol.toLowerCase()
          ),
      ),
    );
  }, []);

  const reset = useCallback(() => setKeys([]), []);

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        eyebrow="종목 비교"
        title="종목을 나란히 비교하기"
        description="기본 정보·가격·실적·재무 지표를 한 화면에서 비교합니다. 최대 4종목까지 동시에 비교할 수 있습니다."
        action={
          stocks.length > 0 ? (
            <button
              type="button"
              onClick={reset}
              className="btn-ghost text-sm"
            >
              모두 비우기
            </button>
          ) : undefined
        }
      />

      {/* Picker + slot summary */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            선택된 종목{" "}
            <span className="font-semibold text-slate-900">
              {stocks.length}
            </span>{" "}
            / {MAX_SLOTS}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stocks.map((s) => (
              <button
                key={`${s.market}-${s.symbol}`}
                type="button"
                onClick={() => remove(s.market, s.symbol)}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800 hover:bg-brand-100"
                title="비교에서 제거"
              >
                {s.name}
                <span className="text-brand-500">{s.symbol}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <StockPicker
            existing={keys}
            disabled={stocks.length >= MAX_SLOTS}
            onPick={add}
          />
        </div>
      </div>

      {/* Comparison */}
      {stocks.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ComparisonTable stocks={stocks} onRemove={remove} />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {stocks.map((s) => (
              <Link
                key={`link-${s.market}-${s.symbol}`}
                href={getStockReportHref(s.market, s.symbol)}
                className="card flex items-center justify-between p-4 transition hover:shadow-cardHover"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {s.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {s.country} · {s.exchange} · {s.symbol}
                  </p>
                </div>
                <span className="text-xs font-medium text-brand-700">
                  리포트 보기 →
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="mt-10">
        <DisclaimerBox />
      </div>
    </div>
  );
}

// ---------- picker ----------

function StockPicker({
  existing,
  disabled,
  onPick,
}: {
  existing: StockKey[];
  disabled: boolean;
  onPick: (stock: Stock) => void;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (mockStocks ?? [])
      .filter((s) => {
        const key = `${s.market}:${s.symbol.toLowerCase()}`;
        if (
          existing.some(
            (e) => `${e.market}:${e.symbol.toLowerCase()}` === key,
          )
        ) {
          return false;
        }
        if (!q) return true;
        return (
          s.name.toLowerCase().includes(q) ||
          s.symbol.toLowerCase().includes(q) ||
          (s.industry ?? "").toLowerCase().includes(q) ||
          (s.sector ?? "").toLowerCase().includes(q)
        );
      })
      .slice(0, 10);
  }, [query, existing]);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        종목 추가
      </label>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        disabled={disabled}
        placeholder={
          disabled
            ? `${MAX_SLOTS}개까지 비교할 수 있습니다`
            : "종목명·티커·업종으로 검색해 추가"
        }
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
      />
      {focused && candidates.length > 0 && !disabled && (
        <ul className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-cardHover">
          {candidates.map((s) => (
            <li key={`${s.market}-${s.symbol}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(s);
                  setQuery("");
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                <span>
                  <span className="font-medium text-slate-900">{s.name}</span>
                  <span className="ml-2 text-xs text-slate-500">
                    {s.symbol}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="badge-slate">
                    {s.country === "한국" ? "한국" : "미국"}
                  </span>
                  {s.industry && (
                    <span className="text-xs text-slate-400">
                      {s.industry}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------- empty state ----------

function EmptyState() {
  const suggestions: Array<{ market: "kr" | "us"; symbol: string }> = [
    { market: "kr", symbol: "005930" },
    { market: "us", symbol: "NVDA" },
  ];
  const href = `/compare?symbols=${suggestions
    .map((s) => `${s.market}:${s.symbol}`)
    .join(",")}`;
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <h3 className="text-base font-semibold text-slate-900">
        비교할 종목을 선택해 주세요.
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        검색해서 추가하거나 아래 예시 조합으로 바로 시작할 수 있습니다.
      </p>
      <div className="mt-5">
        <Link href={href} className="btn-primary text-sm">
          삼성전자 · Nvidia 비교 예시
        </Link>
      </div>
    </div>
  );
}

// ---------- comparison table ----------

function ComparisonTable({
  stocks,
  onRemove,
}: {
  stocks: Stock[];
  onRemove: (market: string, symbol: string) => void;
}) {
  const sections: Array<{
    title: string;
    rows: Array<{ label: string; values: Array<string | null> }>;
  }> = [
    {
      title: "기본 정보",
      rows: [
        { label: "시장", values: stocks.map((s) => `${s.country} · ${s.exchange}`) },
        { label: "업종", values: stocks.map((s) => s.industry ?? "—") },
        { label: "섹터", values: stocks.map((s) => s.sector ?? "—") },
      ],
    },
    {
      title: "가격 정보",
      rows: [
        {
          label: "현재가",
          values: stocks.map((s) => formatDemoPrice(getDemoPriceSnapshot(s))),
        },
        {
          label: "전일 대비",
          values: stocks.map((s) => {
            const c = formatDemoChange(getDemoPriceSnapshot(s));
            return `${c.abs} (${c.pct})`;
          }),
        },
        {
          label: "거래량",
          values: stocks.map((s) => formatDemoVolume(getDemoPriceSnapshot(s))),
        },
        {
          label: "시가총액",
          values: stocks.map((s) => getDemoPriceSnapshot(s).marketCap),
        },
      ],
    },
    {
      title: "실적 요약",
      rows: [
        { label: "보고 기간", values: stocks.map((s) => s.earningsSummary?.period ?? "—") },
        { label: "매출", values: stocks.map((s) => s.earningsSummary?.revenue ?? "—") },
        {
          label: "영업이익",
          values: stocks.map((s) => s.earningsSummary?.operatingProfit ?? "—"),
        },
        { label: "순이익", values: stocks.map((s) => s.earningsSummary?.netProfit ?? "—") },
        {
          label: "매출 전년 대비",
          values: stocks.map((s) => s.earningsSummary?.yoyRevenue ?? "—"),
        },
        {
          label: "영업이익 전년 대비",
          values: stocks.map((s) => s.earningsSummary?.yoyOperatingProfit ?? "—"),
        },
      ],
    },
    {
      title: "재무 지표",
      rows: financialRows(stocks),
    },
  ];

  return (
    <div className="mt-8 space-y-6">
      {sections.map((section) => (
        <section
          key={section.title}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
        >
          <header className="border-b border-slate-200 bg-slate-50 px-4 py-2">
            <h3 className="text-sm font-semibold text-slate-700">
              {section.title}
            </h3>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              {section.title === "기본 정보" && (
                <thead className="bg-white text-xs font-medium uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="w-32 px-4 py-3 text-left">항목</th>
                    {stocks.map((s) => (
                      <th
                        key={`h-${s.market}-${s.symbol}`}
                        className="px-4 py-3 text-left"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-slate-900">
                              {s.name}
                            </span>
                            <span className="ml-1 text-xs text-slate-500">
                              {s.symbol}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(s.market, s.symbol)}
                            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`${s.name} 제거`}
                            title="제거"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-slate-100">
                {section.rows.map((row) => (
                  <tr key={`${section.title}-${row.label}`}>
                    <td className="w-32 px-4 py-2.5 text-xs font-medium text-slate-500">
                      {row.label}
                    </td>
                    {row.values.map((v, i) => (
                      <td
                        key={`${section.title}-${row.label}-${i}`}
                        className="px-4 py-2.5 text-sm tabular-nums text-slate-800"
                      >
                        {v ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

function financialRows(
  stocks: Stock[],
): Array<{ label: string; values: Array<string | null> }> {
  // 종목별 financialMetrics는 라벨 텍스트가 통일되어 있지 않을 수 있으므로
  // 부분 일치(substring)로 매칭합니다. PER/PBR 등은 영문/한글 모두 대응.
  const matchers: Array<{ label: string; needles: string[] }> = [
    { label: "매출 성장률", needles: ["매출 성장률", "Revenue", "매출성장률"] },
    { label: "영업이익률", needles: ["영업이익률", "Operating Income", "영업이익"] },
    { label: "부채비율", needles: ["부채비율", "부채", "Liabilities"] },
    { label: "영업현금흐름", needles: ["현금흐름", "Cash from Operations", "현금"] },
    { label: "PER", needles: ["PER", "P/E"] },
    { label: "PBR", needles: ["PBR", "P/B"] },
  ];

  return matchers.map((m) => ({
    label: m.label,
    values: stocks.map((s) => {
      const hit = (s.financialMetrics ?? []).find((fm) =>
        m.needles.some((n) =>
          fm.label.toLowerCase().includes(n.toLowerCase()),
        ),
      );
      return hit ? hit.value : "—";
    }),
  }));
}

// ---------- page export ----------

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="container-page py-20" />}>
      <CompareInner />
    </Suspense>
  );
}
