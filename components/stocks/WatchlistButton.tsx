"use client";

/**
 * 관심종목 추가 버튼.
 *
 * 클릭 시 회원가입 페이지(`/signup`)로 이동합니다. 다만 사용자가 이전에
 * 회원가입 흐름을 거쳤거나 로그인 페이지로 이동한 적이 있어 인증 힌트
 * 플래그가 켜진 상태라면 로그인 페이지(`/login`)로 이동합니다.
 *
 * 후속 단계에서 Supabase 세션이 활성화되면 이 컴포넌트가 직접 인증 상태를
 * 확인하고, 로그인된 경우 실제로 관심종목을 저장하도록 확장됩니다.
 */

import { useRouter } from "next/navigation";
import { hasAccountHint } from "@/lib/authHint";

interface WatchlistButtonProps {
  market: "kr" | "us";
  symbol: string;
  /** 향후 인증 연결 시 사용. 현재 클릭 동작에는 영향을 주지 않습니다. */
  name?: string;
  exchange?: string | null;
  sector?: string | null;
  initialInWatchlist?: boolean;
  isLoggedIn?: boolean;
  variant?: "default" | "compact";
}

export default function WatchlistButton({
  market,
  symbol,
  variant = "default",
}: WatchlistButtonProps) {
  const router = useRouter();

  function handleClick() {
    const next = `/stocks/${market}/${symbol}`;
    // hasAccountHint() 는 클릭 시점에 다시 평가되므로 SSR/CSR 양쪽에서 안전합니다.
    const target = hasAccountHint() ? "/login" : "/signup";
    router.push(`${target}?next=${encodeURIComponent(next)}`);
  }

  const sizing =
    variant === "compact" ? "text-xs px-2.5 py-1.5" : "text-sm px-4 py-2";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white font-medium text-slate-700 transition hover:bg-slate-50 ${sizing}`}
      aria-label="관심종목에 추가"
      title="로그인하고 관심종목으로 추가합니다"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.365-2.446a1 1 0 00-1.176 0l-3.365 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
        />
      </svg>
      관심종목 추가
    </button>
  );
}
