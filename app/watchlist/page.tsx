import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import { mockWatchlist } from "@/lib/mockBriefing";
import { getStockReportHref } from "@/lib/utils";

export default function WatchlistPage() {
  const watchlist = mockWatchlist ?? [];
  const totalDisclosures = watchlist.reduce(
    (a, b) => a + (b.newDisclosureCount ?? 0),
    0,
  );
  const totalNews = watchlist.reduce(
    (a, b) => a + (b.newNewsCount ?? 0),
    0,
  );
  const totalEarnings = watchlist.filter((w) =>
    Boolean(w.upcomingEarnings),
  ).length;

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="관심종목"
        title="관심종목 정보를 한눈에"
        description="관심 있는 종목의 신규 공시·뉴스·실적 일정을 한 곳에서 확인할 수 있습니다."
      />

      <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-900">
              관심종목 저장 기능 안내
            </p>
            <p className="mt-1 text-sm leading-6 text-brand-900/90">
              관심종목 기능은 1단계 B에서 로그인과 함께 제공될 예정입니다. 현재
              화면은 향후 제공될 UI를 미리 보여주는 목업 화면입니다.
            </p>
          </div>
        </div>
      </div>

      {/* WATCHLIST BRIEFING */}
      <div className="mt-8 card p-6">
        <h3 className="text-lg font-bold text-slate-900">관심종목 브리핑</h3>
        <p className="mt-1 text-xs text-slate-500">
          관심종목에 등록된 종목들의 정보 흐름을 한 번에 요약합니다.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">신규 공시</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {totalDisclosures}건
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">신규 뉴스</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {totalNews}건
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">예정된 실적 발표</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {totalEarnings}건
            </p>
          </div>
        </div>
      </div>

      {/* WATCHLIST LIST */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-900">관심종목 목록</h3>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="hidden bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500 sm:table-header-group">
              <tr>
                <th className="px-4 py-3 text-left">종목</th>
                <th className="px-4 py-3 text-center">신규 공시</th>
                <th className="px-4 py-3 text-center">신규 뉴스</th>
                <th className="px-4 py-3 text-left">실적 일정</th>
                <th className="px-4 py-3 text-right">리포트</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {watchlist.map((w) => (
                <tr
                  key={`${w.market}-${w.symbol}`}
                  className="flex flex-col gap-2 p-4 sm:table-row sm:p-0"
                >
                  <td className="sm:px-4 sm:py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {w.name}
                      </span>
                      <span className="badge-outline">{w.symbol}</span>
                      <span className="badge-slate">{w.exchange}</span>
                    </div>
                  </td>
                  <td className="sm:px-4 sm:py-3 sm:text-center">
                    <span className="text-xs text-slate-500 sm:hidden">
                      신규 공시:{" "}
                    </span>
                    <span className="font-medium text-slate-900">
                      {w.newDisclosureCount}
                    </span>
                  </td>
                  <td className="sm:px-4 sm:py-3 sm:text-center">
                    <span className="text-xs text-slate-500 sm:hidden">
                      신규 뉴스:{" "}
                    </span>
                    <span className="font-medium text-slate-900">
                      {w.newNewsCount}
                    </span>
                  </td>
                  <td className="text-xs text-slate-600 sm:px-4 sm:py-3 sm:text-sm">
                    {w.upcomingEarnings ?? "—"}
                  </td>
                  <td className="sm:px-4 sm:py-3 sm:text-right">
                    <Link
                      href={getStockReportHref(w.market, w.symbol)}
                      className="btn-outline text-xs"
                    >
                      리포트 보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <DisclaimerBox />
      </div>
    </div>
  );
}
