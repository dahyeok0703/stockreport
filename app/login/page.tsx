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
              회원 기능은 준비 중입니다
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-900/90">
              {enabled
                ? "이 페이지는 데모 모드입니다. 로그인 기능은 다음 단계에서 활성화됩니다."
                : "현재 인증 서비스(Supabase) 연결이 비활성화되어 있습니다. 환경 변수가 설정되면 로그인을 사용할 수 있습니다."}
            </p>
            <p className="mt-2 text-sm leading-6 text-amber-900/90">
              지금은 로그인 없이 종목 검색·리포트·관심종목(이 기기에만 저장)을
              모두 사용할 수 있습니다.
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
