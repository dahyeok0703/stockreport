import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import RemoveWatchlistButton from "@/components/stocks/RemoveWatchlistButton";
import { getCurrentAuth } from "@/lib/auth";
import { getPlanLimit } from "@/lib/planLimits";
import { getMyWatchlist } from "@/lib/watchlist";
import { getStockReportHref } from "@/lib/utils";

export const metadata = {
  title: "관심종목 | 스톡리포트",
};

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const { user, profile, configured } = await getCurrentAuth();

  // 비로그인 사용자 안내
  if (!user) {
    return (
      <div className="container-page py-12 sm:py-16">
        <SectionTitle
          eyebrow="관심종목"
          title="관심종목 정보를 한눈에"
          description="관심 있는 종목의 신규 공시·뉴스·실적 일정을 한 곳에서 확인할 수 있습니다."
        />

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-card">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            관심종목 기능을 사용하려면 로그인이 필요합니다.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            로그인하면 종목을 저장하고 공시·뉴스·실적 흐름을 한 곳에서 추적할
            수 있습니다.
          </p>
          {!configured && (
            <p className="mt-3 text-xs text-amber-700">
              현재 Supabase 환경 변수가 설정되지 않아 인증 기능이 비활성화된
              상태입니다.
            </p>
          )}
          <div className="mt-6 flex items-center justify-center gap-2">
            <Link href="/login?next=/watchlist" className="btn-primary">
              로그인
            </Link>
            <Link href="/signup?next=/watchlist" className="btn-outline">
              회원가입
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <DisclaimerBox />
        </div>
      </div>
    );
  }

  const items = await getMyWatchlist();
  const limit = getPlanLimit(profile?.plan);

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="관심종목"
        title="내 관심종목"
        description={`현재 요금제 ${limit.label} · ${items.length} / ${limit.watchlistMax}개 저장됨`}
        action={
          <Link href="/search" className="btn-outline text-sm">
            종목 추가하기
          </Link>
        }
      />

      {items.length === 0 ? (
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
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="hidden bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500 sm:table-header-group">
              <tr>
                <th className="px-4 py-3 text-left">종목</th>
                <th className="px-4 py-3 text-left">시장</th>
                <th className="px-4 py-3 text-left">업종</th>
                <th className="px-4 py-3 text-right">동작</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((w) => (
                <tr
                  key={w.id}
                  className="flex flex-col gap-2 p-4 sm:table-row sm:p-0"
                >
                  <td className="sm:px-4 sm:py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {w.name}
                      </span>
                      <span className="badge-outline">{w.symbol}</span>
                    </div>
                  </td>
                  <td className="sm:px-4 sm:py-3">
                    <span className="badge-slate">
                      {w.market === "kr" ? "한국" : "미국"}
                    </span>
                    {w.exchange && (
                      <span className="ml-1 text-xs text-slate-500">
                        {w.exchange}
                      </span>
                    )}
                  </td>
                  <td className="text-sm text-slate-600 sm:px-4 sm:py-3">
                    {w.sector ?? "—"}
                  </td>
                  <td className="sm:px-4 sm:py-3 sm:text-right">
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Link
                        href={getStockReportHref(
                          w.market as "kr" | "us",
                          w.symbol,
                        )}
                        className="btn-outline text-xs"
                        title="리포트 페이지에서 최신 데이터를 다시 불러옵니다"
                      >
                        데이터 새로고침
                      </Link>
                      <Link
                        href={getStockReportHref(
                          w.market as "kr" | "us",
                          w.symbol,
                        )}
                        className="btn-ghost text-xs"
                      >
                        리포트 보기
                      </Link>
                      <RemoveWatchlistButton
                        market={w.market}
                        symbol={w.symbol}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10">
        <DisclaimerBox />
      </div>
    </div>
  );
}
