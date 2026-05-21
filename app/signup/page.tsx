import { Suspense } from "react";
import SafeAuthForm from "@/components/auth/SafeAuthForm";

export const metadata = {
  title: "회원가입 | 스톡리포트",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-900">회원가입</h1>
          <p className="mt-1 text-sm text-slate-600">
            이메일로 무료 계정을 만들고 관심종목 기능을 이용해 보세요.
          </p>
          <div className="mt-6">
            <Suspense
              fallback={
                <div className="h-72 animate-pulse rounded-lg bg-slate-100" />
              }
            >
              <SafeAuthForm mode="signup" />
            </Suspense>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          가입 시 이용약관과 개인정보처리방침에 동의하는 것으로 간주됩니다.
          본 서비스는 정보 제공용이며, 특정 종목의 매수·매도·보유를 권유하지
          않습니다.
        </p>
      </div>
    </div>
  );
}
