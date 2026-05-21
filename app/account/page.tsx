import Link from "next/link";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import SectionTitle from "@/components/common/SectionTitle";
import { PLAN_LIMITS } from "@/lib/planLimits";

export const metadata = {
  title: "내 계정 | 스톡리포트",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AccountPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="내 계정"
        title="계정 정보"
        description="요금제 한도와 사용량을 한 곳에서 확인할 수 있습니다."
      />

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            계정
          </h3>
          <p className="mt-2 text-base text-slate-700">
            로그인 후 이메일·요금제·사용량이 이곳에 표시됩니다.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link href="/login?next=/account" className="btn-primary text-sm">
              로그인
            </Link>
            <Link href="/signup?next=/account" className="btn-outline text-sm">
              회원가입
            </Link>
            <Link href="/pricing" className="btn-ghost text-sm">
              요금제 보기
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            요금제
          </h3>
          <p className="mt-2 text-2xl font-bold text-brand-700">무료</p>
          <p className="mt-1 text-xs text-slate-500">
            로그인 후 실제 사용량과 한도가 표시됩니다.
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <DemoRow
              label="오늘 리포트 조회"
              value={`최대 ${PLAN_LIMITS.free.dailyReportViews}회`}
            />
            <DemoRow
              label="오늘 AI 요약"
              value={`최대 ${PLAN_LIMITS.free.dailyAiSummaries}회`}
            />
            <DemoRow
              label="관심종목"
              value={`최대 ${PLAN_LIMITS.free.watchlistMax}개`}
            />
          </dl>
        </div>
      </div>

      <section className="mt-12">
        <h3 className="text-lg font-bold text-slate-900">요금제별 한도</h3>
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
