import Link from "next/link";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import { hasSupabaseConfig } from "@/lib/env";

export const metadata = {
  title: "로그인 | 스톡리포트",
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const enabled = hasSupabaseConfig();

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-900">로그인</h1>
          <p className="mt-1 text-sm text-slate-600">
            관심종목·사용량 추적 등 회원 기능을 사용하기 위해 로그인해 주세요.
          </p>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-900">
              회원 기능은 준비 중입니다.
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-900/90">
              현재 데모 모드에서는 관심종목이 브라우저에 임시 저장됩니다.
            </p>
            <p className="mt-2 text-sm leading-6 text-amber-900/90">
              정식 서비스 단계에서 회원가입, 로그인, 요금제 기능이 제공될
              예정입니다.
              {!enabled &&
                " (현재 인증 서비스 연결도 비활성화되어 있습니다.)"}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link href="/search" className="btn-primary text-center">
              종목 검색으로 이동
            </Link>
            <Link href="/watchlist" className="btn-outline text-center">
              관심종목 보기
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <DisclaimerBox variant="compact" />
        </div>
      </div>
    </div>
  );
}
