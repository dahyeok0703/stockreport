"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";

interface WatchlistButtonProps {
  market: string;
  symbol: string;
  name: string;
  exchange?: string | null;
  sector?: string | null;
  /** initial known state — fetched on the server */
  initialInWatchlist: boolean;
  /** when false, clicking redirects to /login?next=… */
  isLoggedIn: boolean;
  variant?: "default" | "compact";
}

export default function WatchlistButton({
  market,
  symbol,
  name,
  exchange,
  sector,
  initialInWatchlist,
  isLoggedIn,
  variant = "default",
}: WatchlistButtonProps) {
  const router = useRouter();
  const [inList, setInList] = useState(initialInWatchlist);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    if (!isLoggedIn) {
      const next = encodeURIComponent(`/stocks/${market}/${symbol}`);
      router.push(`/login?next=${next}`);
      return;
    }
    startTransition(async () => {
      if (inList) {
        const res = await removeFromWatchlist(market, symbol);
        if (!res.ok) {
          setError(res.error ?? "삭제 실패");
          return;
        }
        setInList(false);
      } else {
        const res = await addToWatchlist({
          market,
          symbol,
          name,
          exchange,
          sector,
        });
        if (!res.ok) {
          setError(res.error ?? "추가 실패");
          // If the row already exists, surface the actual state.
          if (res.error?.includes("이미")) setInList(true);
          return;
        }
        setInList(true);
      }
    });
  }

  const sizing =
    variant === "compact"
      ? "text-xs px-2.5 py-1.5"
      : "text-sm px-4 py-2";

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-md font-medium transition disabled:opacity-60 ${sizing} ${
          inList
            ? "border border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100"
            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
        aria-pressed={inList}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={inList ? "currentColor" : "none"}
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
          : inList
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
