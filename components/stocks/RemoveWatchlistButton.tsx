"use client";

/**
 * 관심종목 페이지에서 사용하는 삭제 버튼 — localStorage 기반.
 */

import { useState } from "react";
import { removeLocalWatchlist } from "@/lib/watchlistLocal";

interface RemoveWatchlistButtonProps {
  market: string;
  symbol: string;
}

export default function RemoveWatchlistButton({
  market,
  symbol,
}: RemoveWatchlistButtonProps) {
  const [pending, setPending] = useState(false);

  function handleClick() {
    if (market !== "kr" && market !== "us") return;
    setPending(true);
    try {
      removeLocalWatchlist(market, symbol);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-md border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
    >
      {pending ? "삭제 중…" : "삭제"}
    </button>
  );
}
