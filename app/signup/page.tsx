import Link from "next/link";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import { hasSupabaseConfig } from "@/lib/env";

export const metadata = {
  title: "회원가입 | 스톡리포트",
};

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const enabled = hasSupabaseConfig();

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-900">회원가입</h1>
          <p className="mt-1 text-sm text-slate-600">
            관심종목 동기화·이메일 알림·요금제 이용을 위해 회원가입이 제공될
            예정입니다.
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
              종목 검색 둘러보기
            </Link>
            <Link href="/pricing" className="btn-outline text-center">
              요금제 보기
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          본 서비스는 정보 제공용이며, 특정 종목의 매수·매도·보유를 권유하지
          않습니다.
        </p>
        <div className="mt-4">
          <DisclaimerBox variant="compact" />
        </div>
      </div>
    </div>
  );
}
