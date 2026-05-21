"use client";

import { useState, useTransition } from "react";
import { removeFromWatchlist } from "@/lib/watchlist";

interface RemoveWatchlistButtonProps {
  market: string;
  symbol: string;
}

export default function RemoveWatchlistButton({
  market,
  symbol,
}: RemoveWatchlistButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const res = await removeFromWatchlist(market, symbol);
      if (!res.ok) setError(res.error ?? "삭제 실패");
    });
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-md border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
      >
        {pending ? "삭제 중…" : "삭제"}
      </button>
      {error && (
        <span className="text-xs text-rose-600">{error}</span>
      )}
    </div>
  );
}
