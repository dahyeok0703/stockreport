import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "로그인 | 스톡리포트",
};

export default function LoginPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-900">로그인</h1>
          <p className="mt-1 text-sm text-slate-600">
            관심종목 저장과 일일 사용량 추적을 위해 로그인해 주세요.
          </p>
          <div className="mt-6">
            <Suspense
              fallback={<div className="h-64 animate-pulse rounded-lg bg-slate-100" />}
            >
              <AuthForm mode="login" />
            </Suspense>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          본 서비스는 정보 제공용이며, 특정 종목의 매수·매도·보유를 권유하지
          않습니다.
        </p>
      </div>
    </div>
  );
}
