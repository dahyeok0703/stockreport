import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import SectionTitle from "@/components/common/SectionTitle";
import { getCurrentAuth } from "@/lib/auth";
import { PLAN_LIMITS, getPlanLimit } from "@/lib/planLimits";
import { getTodayUsageStatus } from "@/lib/usage";
import { getMyWatchlist } from "@/lib/watchlist";

export const metadata = {
  title: "내 계정 | 스톡리포트",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { user, profile, configured } = await getCurrentAuth();

  if (!configured) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-xl rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-lg font-bold text-amber-900">
            인증 기능이 비활성화되어 있습니다
          </h1>
          <p className="mt-2 text-sm text-amber-900">
            Supabase 환경 변수가 설정되지 않아 계정 기능을 사용할 수 없습니다.
            <code className="mx-1 rounded bg-amber-100 px-1">.env.example</code>
            을 참고해 환경 변수를 설정한 뒤 다시 시도해 주세요.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect("/login?next=/account");
  }

  const planLimit = getPlanLimit(profile?.plan);
  const usageStatus = await getTodayUsageStatus();
  const watchlist = await getMyWatchlist();
  const todayViews = usageStatus.usage?.report_views ?? 0;

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="내 계정"
        title="계정 정보"
        description="현재 요금제와 오늘 사용량, 관심종목 한도를 확인할 수 있습니다."
      />

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            계정
          </h3>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {user.email}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            가입일 ·{" "}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("ko-KR")
              : "—"}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <LogoutButton className="btn-outline text-sm" />
            <Link href="/pricing" className="btn-ghost text-sm">
              요금제 보기
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            현재 요금제
          </h3>
          <p className="mt-2 text-2xl font-bold text-brand-700">
            {planLimit.label}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            결제 기능은 이후 단계에서 제공될 예정입니다.
          </p>

          <dl className="mt-5 space-y-3 text-sm">
            <UsageRow
              label="오늘 리포트 조회"
              current={todayViews}
              max={planLimit.dailyReportViews}
            />
            <UsageRow
              label="관심종목"
              current={watchlist.length}
              max={planLimit.watchlistMax}
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
                <th className="px-4 py-3 text-right">관심종목 한도</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {Object.values(PLAN_LIMITS).map((p) => {
                const isCurrent = p.code === planLimit.code;
                return (
                  <tr
                    key={p.code}
                    className={isCurrent ? "bg-brand-50/60" : undefined}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">
                        {p.label}
                      </span>
                      {isCurrent && (
                        <span className="ml-2 badge-brand">현재</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {p.dailyReportViews}회 / 일
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {p.watchlistMax}개
                    </td>
                  </tr>
                );
              })}
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

function UsageRow({
  label,
  current,
  max,
}: {
  label: string;
  current: number;
  max: number;
}) {
  const ratio = Math.min(1, max === 0 ? 0 : current / max);
  const percent = Math.round(ratio * 100);
  const isNearLimit = ratio >= 0.8;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium tabular-nums text-slate-900">
          {current} / {max}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            isNearLimit ? "bg-rose-500" : "bg-brand-600"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
