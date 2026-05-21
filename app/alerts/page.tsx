"use client";

/**
 * 공시·실적·뉴스 알림 피드.
 *
 * 사용자가 관심종목으로 추가한 종목이 있다면 "관심종목" 탭에서 해당 종목
 * 관련 알림만 모아 볼 수 있고, "전체" 탭에서는 모든 종목의 최근 활동을
 * 확인할 수 있습니다.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import {
  getAlertsByType,
  getAlertsForSymbols,
  type AlertItem,
  type AlertType,
} from "@/lib/alertsFeed";
import { useLocalWatchlist } from "@/lib/watchlistLocal";

type Scope = "all" | "watchlist";
type Filter = "all" | AlertType;

const FILTER_TABS: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "filing", label: "공시" },
  { value: "earnings", label: "실적" },
  { value: "news", label: "뉴스" },
];

const TYPE_BADGE: Record<AlertType, string> = {
  filing: "bg-emerald-50 text-emerald-800 border-emerald-200",
  earnings: "bg-brand-50 text-brand-800 border-brand-200",
  news: "bg-amber-50 text-amber-800 border-amber-200",
};

const TYPE_LABEL: Record<AlertType, string> = {
  filing: "공시",
  earnings: "실적",
  news: "뉴스",
};

function relativeDate(d: string): string {
  try {
    const date = new Date(d.length === 10 ? d + "T09:00:00" : d);
    const diff = Date.now() - date.getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    if (diff < dayMs) return "오늘";
    if (diff < 2 * dayMs) return "어제";
    const days = Math.floor(diff / dayMs);
    if (days < 7) return `${days}일 전`;
    return d.slice(0, 10);
  } catch {
    return d;
  }
}

export default function AlertsPage() {
  const { items: watchlist, hydrated } = useLocalWatchlist();
  const [scope, setScope] = useState<Scope>("all");
  const [filter, setFilter] = useState<Filter>("all");

  // 관심종목이 있으면 첫 진입 시 "관심종목" 탭으로 자동 전환
  useEffect(() => {
    if (hydrated && watchlist.length > 0) {
      setScope("watchlist");
    }
  }, [hydrated, watchlist.length]);

  const watchlistKeySet = useMemo(() => {
    const s = new Set<string>();
    for (const w of watchlist) s.add(`${w.market}:${w.symbol.toLowerCase()}`);
    return s;
  }, [watchlist]);

  const alerts = useMemo(() => {
    const base =
      scope === "watchlist"
        ? getAlertsForSymbols(watchlistKeySet)
        : getAlertsByType("all");
    if (filter === "all") return base;
    return base.filter((a) => a.type === filter);
  }, [scope, filter, watchlistKeySet]);

  const countByType = useMemo(() => {
    const base =
      scope === "watchlist"
        ? getAlertsForSymbols(watchlistKeySet)
        : getAlertsByType("all");
    return {
      all: base.length,
      filing: base.filter((a) => a.type === "filing").length,
      earnings: base.filter((a) => a.type === "earnings").length,
      news: base.filter((a) => a.type === "news").length,
    };
  }, [scope, watchlistKeySet]);

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        eyebrow="알림"
        title="공시·실적·뉴스 알림"
        description="관심종목과 전체 종목의 최근 공시·실적 발표·뉴스 흐름을 한 페이지에서 확인합니다."
      />

      {/* Scope tabs */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <ScopeTab
            active={scope === "all"}
            onClick={() => setScope("all")}
            label="전체 종목"
          />
          <ScopeTab
            active={scope === "watchlist"}
            onClick={() => setScope("watchlist")}
            label={`관심종목${
              hydrated && watchlist.length > 0 ? ` (${watchlist.length})` : ""
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {FILTER_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setFilter(t.value)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                filter === t.value
                  ? "border-brand-600 bg-brand-50 text-brand-800"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t.label}
              <span className="ml-1 text-slate-400">
                {t.value === "all"
                  ? countByType.all
                  : countByType[t.value as AlertType]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="mt-6">
        {scope === "watchlist" && hydrated && watchlist.length === 0 ? (
          <EmptyWatchlist />
        ) : alerts.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-3">
            {alerts.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <DisclaimerBox />
      </div>
    </div>
  );
}

function ScopeTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {label}
    </button>
  );
}

function AlertCard({ alert }: { alert: AlertItem }) {
  return (
    <li>
      <Link
        href={alert.reportHref}
        className="card flex flex-col gap-2 p-4 transition hover:shadow-cardHover sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${TYPE_BADGE[alert.type]}`}
            >
              {TYPE_LABEL[alert.type]}
            </span>
            <span className="badge-slate">
              {alert.market === "kr" ? "한국" : "미국"}
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {alert.companyName}
            </span>
            <span className="text-xs text-slate-500">{alert.symbol}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {alert.title}
          </p>
          {alert.summary && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
              {alert.summary}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            {alert.publisher && <span>{alert.publisher}</span>}
            <span>{relativeDate(alert.publishedAt)}</span>
            <span className="text-slate-400">· {alert.publishedAt}</span>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center text-xs font-medium text-brand-700">
          리포트 →
        </div>
      </Link>
    </li>
  );
}

function EmptyWatchlist() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <h3 className="text-base font-semibold text-slate-900">
        관심종목이 아직 없습니다.
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        종목 검색에서 관심종목을 추가하면 관련 공시·실적·뉴스 알림이 이곳에
        모입니다.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Link href="/search" className="btn-primary text-sm">
          종목 검색으로 이동
        </Link>
        <Link href="/watchlist" className="btn-outline text-sm">
          관심종목 페이지
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <p className="text-sm text-slate-600">
        조건에 맞는 알림이 없습니다. 다른 탭이나 필터를 선택해 보세요.
      </p>
    </div>
  );
}
