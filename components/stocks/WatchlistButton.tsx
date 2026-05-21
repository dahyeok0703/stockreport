"use client";

/**
 * 데모 모드 관심종목 추가/해제 버튼 — localStorage 기반.
 *
 * 1B에서 Supabase 서버 액션을 호출하던 버전을 대체합니다. 서버 인증/사용량
 * 제한을 요구하지 않고, 같은 브라우저 내에서만 보존됩니다. 후속 단계에서
 * Supabase가 다시 켜지면 lib/watchlist.ts 액션 호출로 되돌릴 수 있도록
 * 컴포넌트 이름과 props는 동일하게 유지합니다.
 */

import { useEffect, useState } from "react";
import {
  addLocalWatchlist,
  isInLocalWatchlist,
  removeLocalWatchlist,
} from "@/lib/watchlistLocal";

interface WatchlistButtonProps {
  market: "kr" | "us";
  symbol: string;
  name: string;
  exchange?: string | null;
  sector?: string | null;
  /** 1B에서 사용하던 props — 데모 모드에서는 무시되지만 호출 호환을 위해 유지 */
  initialInWatchlist?: boolean;
  /** 1B 호환 — 데모 모드에서는 항상 true 취급 (로그인 강제 안 함) */
  isLoggedIn?: boolean;
  variant?: "default" | "compact";
}

export default function WatchlistButton({
  market,
  symbol,
  name,
  exchange,
  sector,
  variant = "default",
}: WatchlistButtonProps) {
  const [hydrated, setHydrated] = useState(false);
  const [inList, setInList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setInList(isInLocalWatchlist(market, symbol));
    setHydrated(true);
    const onChange = () => setInList(isInLocalWatchlist(market, symbol));
    window.addEventListener("storage", onChange);
    window.addEventListener("stockreport:watchlist:changed", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("stockreport:watchlist:changed", onChange);
    };
  }, [market, symbol]);

  function handleClick() {
    setError(null);
    setPending(true);
    try {
      if (inList) {
        removeLocalWatchlist(market, symbol);
        setInList(false);
      } else {
        const res = addLocalWatchlist({ market, symbol, name, exchange, sector });
        if (!res.ok) {
          if (res.reason === "duplicate") {
            setInList(true);
          } else if (res.reason === "limit") {
            setError("관심종목은 최대 50개까지 저장할 수 있습니다.");
          }
          return;
        }
        setInList(true);
      }
    } finally {
      setPending(false);
    }
  }

  const sizing =
    variant === "compact" ? "text-xs px-2.5 py-1.5" : "text-sm px-4 py-2";

  // SSR 단계에서는 항상 "추가" 상태로 렌더 → mount 후 실제 상태 반영
  const showActive = hydrated && inList;

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-md font-medium transition disabled:opacity-60 ${sizing} ${
          showActive
            ? "border border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100"
            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
        aria-pressed={showActive}
        title="관심종목에 추가하거나 해제합니다"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={showActive ? "currentColor" : "none"}
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
        {pending
          ? "처리 중…"
          : showActive
            ? "관심종목 해제"
            : "관심종목 추가"}
      </button>
      {error && (
        <span className="max-w-xs text-right text-xs text-rose-600">
          {error}
        </span>
      )}
    </div>
  );
}
