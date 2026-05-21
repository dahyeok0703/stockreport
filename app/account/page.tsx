import Link from "next/link";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import SectionTitle from "@/components/common/SectionTitle";
import { PLAN_LIMITS } from "@/lib/planLimits";

export const metadata = {
  title: "내 계정 | 스톡리포트",
};

export const dynamic = "force-dynamic";

/**
 * 데모 모드 계정 페이지.
 *
 * Supabase 인증과 사용량 추적은 1B에서 구현되어 lib/auth.ts, lib/usage.ts,
 * lib/watchlist.ts에 보존되어 있습니다. 현재는 데모 모드로 회원 기능을
 * 비활성화하고, 요금제 한도 비교 표만 정보 제공용으로 표시합니다.
 */
export default function AccountPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="내 계정"
        title="계정 정보"
        description="회원 기능은 준비 중입니다. 현재는 요금제별 한도만 미리 확인하실 수 있습니다."
      />

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            계정
          </h3>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            데모 사용자
          </p>
          <p className="mt-1 text-xs text-slate-500">
            로그인 기능이 활성화되면 이메일·요금제·사용량이 이곳에 표시됩니다.
          </p>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              회원 기능은 준비 중입니다
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-900/90">
              현재는 로그인 없이 종목 검색·리포트·관심종목(이 기기에만 저장)을
              모두 이용할 수 있습니다.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link href="/search" className="btn-outline text-sm">
              종목 검색
            </Link>
            <Link href="/watchlist" className="btn-ghost text-sm">
              관심종목
            </Link>
            <Link href="/pricing" className="btn-ghost text-sm">
              요금제 보기
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            데모 모드 한도
          </h3>
          <p className="mt-2 text-2xl font-bold text-brand-700">데모</p>
          <p className="mt-1 text-xs text-slate-500">
            결제·요금제 적용은 이후 단계에서 제공될 예정입니다.
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <DemoRow label="오늘 리포트 조회" value="추적 안 함" />
            <DemoRow label="오늘 AI 요약" value="추적 안 함" />
            <DemoRow label="관심종목" value="이 기기 저장" />
          </dl>
        </div>
      </div>

      <section className="mt-12">
        <h3 className="text-lg font-bold text-slate-900">요금제별 한도 (예정)</h3>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">요금제</th>
                <th className="px-4 py-3 text-right">하루 리포트 조회</th>
                <th className="px-4 py-3 text-right">하루 AI 요약</th>
                <th className="px-4 py-3 text-right">관심종목 한도</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {Object.values(PLAN_LIMITS).map((p) => (
                <tr key={p.code}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">
                      {p.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {p.dailyReportViews}회 / 일
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {p.dailyAiSummaries}회 / 일
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {p.watchlistMax}개
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-10">
        <DisclaimerBox />
      </div>
    </div>
  );
}

function DemoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}
